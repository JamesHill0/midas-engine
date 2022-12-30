import threading
import requests
import time

from schema import Schema
from logger import Logger
from env import Env
from salesforce import SF
from postgres import PG
from enums import SYNC_LOG_STATUS

log_name = "sync-sh"

# init class objects
e = Env()
logger = Logger()
pg = PG(logger, log_name)
sf = SF(logger, log_name)
sch = Schema(logger, log_name)

class CreateSync(threading.Thread):
    def __init__(self):
        super(CreateSync, self).__init__()

    def run(self):
        records = pg.get_all(sch.sync_logs_table_name(), "status = %s" % (SYNC_LOG_STATUS.CREATE.value))
        
        for record in records:
            try:
                id = record[0]
                data = record[6]

                logger.info(log_name, "processing creating of sf record: %s" % (id))
                create_response = sf.create(e.salesforce_table(), data)

                sf_id = create_response["id"]
                response = sf.get_by_id(e.salesforce_table(), sf_id)

                pg.update(id, sch.sync_logs_table_name(), { "sf_id": sf_id, "sf_name": response["name"], "status": SYNC_LOG_STATUS.CREATED.value })
            except Exception as err:
                pg.update(id, sch.sync_logs_table_name(), { "status": SYNC_LOG_STATUS.FAILED.value })
                logger.error(log_name, "failed to create sf record: %s" % (err))

        records = pg.get_all(sch.sync_logs_table_name(), "status = %s" % (SYNC_LOG_STATUS.CREATED.value))

        for record in records:
            try:
                external_id = record[1]
                sf_id = record[2]
                sf_name = record[3]
                hook_url = record[5]

                url = "%s/%s" % (hook_url, external_id)
                requests.patch(url=url, headers=headers(), json={ "status": "finished", "result": { "Salesforce ID": sf_id, "Firelight Policy Name": sf_name } })
                time.sleep(5)
            except Exception as err:
                logger.error(log_name, "failed to send update of creating sf record through hook: %s" % (err))
        

class UpdateSync(threading.Thread):
    def __init__(self):
        super(UpdateSync, self).__init__()

    def run(self):
        records = pg.get_all(sch.sync_logs_table_name(), "status = %s" % (SYNC_LOG_STATUS.UPDATE.value))

        for record in records:
            try:
                id = record[0]
                sf_id = record[2]
                data = record[6]

                logger.info(log_name, "processing updating of sf record: %s" % (id))
                sf.update(e.salesforce_table(), sf_id, data)
                pg.update(id, sch.sync_logs_table_name(), { "status": SYNC_LOG_STATUS.UPDATED.value })
            except Exception as err:
                pg.update(id, sch.sync_logs_table_name(), { "status": SYNC_LOG_STATUS.FAILED.value })
                logger.error(log_name, "failed to update sf record: %s" % (err))

        records = pg.get_all(sch.sync_logs_table_name(), "status = %s" % (SYNC_LOG_STATUS.UPDATED.value))

        for record in records:
            try:
                external_id = record[1]
                sf_id = record[2]
                sf_name = record[3]
                hook_url = record[5]

                url = "%s/%s" % (hook_url, external_id)
                requests.patch(url=url, headers=headers(), json={ "status": "finished", "result": { "Salesforce ID": sf_id, "Firelight Policy Name": sf_name } })
                time.sleep(5)
            except Exception as err:
                logger.error(log_name, "failed to send update of updating sf record through hook: %s" % (err))

def headers():
    return {
        "Content-Type": "application/json",
        "x-api-key": e.api_key()
    }

def run_sync():
    create_sync = CreateSync()
    update_sync = UpdateSync()

    create_sync.start()
    update_sync.start()

if __name__ == "__main__":
    run_sync()
