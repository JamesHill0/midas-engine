from blitz import Blitz
from load_into_salesforce import LoadIntoSalesforce
from logger import Logger
import datetime

class Load:
  def __init__(self):
    self.log_name = 'load'

    self.blitz = Blitz()

    self.load_into_salesforce = LoadIntoSalesforce()

    self.logger = Logger('qa')

  def __check_schedule(self):
    datas = self.blitz.account_get_jobs_by_name('load')

    data = datas[0]
    if data['status'] == 'running':
      self.logger.info('', self.log_name, 'job is still running. checking again later')
      updated_date = datetime.datetime.strptime(data['updated'], "%d%m%Y").date()
      if (datetime.now() - updated_date).minutes > 1440:
        self.blitz.account_update_job(data['id'], { 'status': 'inactive' })
      return { 'status': 'suspended' }

    return data

  def __terminate_schedule(self):
    datas = self.blitz.account_get_jobs_by_name('load')

    data = datas[0]
    self.logger.info('', self.log_name, 'job finished running')
    self.blitz.account_update_job(data['id'], { 'status': 'inactive' })

  def __get_accounts_api_keys(self):
    accounts = self.blitz.account_get_accounts()

    api_keys = []
    for account in accounts:
      api_keys.append(account['apiKey'])

    return api_keys

  def __get_loadable_subworkflows(self, api_keys):
    subworkflows = []
    for api_key in api_keys:
      loadable_subworkflows = self.blitz.mapping_get_loadable_subworkflows({ 'x-api-key': api_key })
      subworkflows.append({
        'api_key': api_key,
        'subworkflows': loadable_subworkflows
      })

    return subworkflows

  def __execute(self):
    self.logger.info('', self.log_name, 'checking scheduler')
    app_state = self.__check_schedule()

    if app_state['status'] == 'running' or app_state['status'] == 'suspended':
      self.logger.info('', self.log_name, 'did not create a new run instance')
      return

    self.blitz.account_update_job(app_state['id'], { 'status': 'running' })

    self.logger.info('', self.log_name, 'retrieving all accounts')
    api_keys = self.__get_accounts_api_keys()
    self.logger.info('', self.log_name, 'finish retrieving all accounts')

    self.logger.info('', self.log_name, 'retrieving loadable workflows')
    loadable_subworkflows = self.__get_loadable_subworkflows(api_keys)
    self.logger.info('', self.log_name, 'finish retrieving loadable workflows')

    for loadable_subworkflow in loadable_subworkflows:
      for subworkflow in loadable_subworkflow['subworkflows']:
        api_key = loadable_subworkflow['api_key']

        workflow = self.blitz.mapping_get_workflow_by_id({ 'x-api-key': api_key }, subworkflow['workflowId'])

        if workflow['status'] == 'inactive':
          self.logger.info(api_key, self.log_name, workflow['name'] + ' is inactive. skipping.')
          continue

        if subworkflow['integrationType'] == 'salesforce':
          self.logger.info(api_key, self.log_name, 'loading into salesforce for workflow ' + workflow['name'])
          self.load_into_salesforce.run(api_key, subworkflow)
          self.logger.info(api_key, self.log_name, 'finish loading into salesforce for workflow ' + workflow['name'])

  def run(self):
    try:
      self.__execute()
      self.__terminate_schedule()
    except:
      self.logger.exception('', self.log_name, 'something went wrong')
      self.__terminate_schedule()

if __name__ == '__main__':
  app = Load()
  app.run()
