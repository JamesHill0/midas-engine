from blitz import Blitz
from extract_from_smartfile import ExtractFromSmartFile
from extract_from_webhook import ExtractFromWebhook
from extract_from_salesforce import ExtractFromSalesforce
from logger import Logger

from dateutil.parser import parse
from datetime import datetime, timezone

class Extract:
  def __init__(self):
    self.log_name = 'extract'

    self.blitz = Blitz()

    self.extract_from_smartfile = ExtractFromSmartFile()
    self.extract_from_webhook = ExtractFromWebhook()
    self.extract_from_salesforce = ExtractFromSalesforce()

    self.logger = Logger('qa')

  def __check_schedule(self):
    datas = self.blitz.account_get_jobs_by_name('extract')

    data = datas[0]
    if data['status'] == 'running':
      self.logger.info('', self.log_name, 'job is still running. checking again later')
      updated_date = parse(data['updated'])
      result_date = datetime.now() - updated_date.replace(tzinfo=None)
      if (result_date.days) > 0:
        self.blitz.account_update_job(data['id'], { 'status': 'inactive' })
      return { 'status': 'suspended' }

    return data

  def __terminate_schedule(self):
    datas = self.blitz.account_get_jobs_by_name('extract')

    data = datas[0]
    self.logger.info('', self.log_name, 'job finished running')
    self.blitz.account_update_job(data['id'], { 'status': 'inactive' })

  def __get_accounts_api_keys(self):
    accounts = self.blitz.account_get_accounts()

    api_keys = []
    for account in accounts:
      api_keys.append(account['apiKey'])

    return api_keys

  def __get_extractable_subworkflows(self, api_keys):
    subworkflows = []
    for api_key in api_keys:
      extractable_subworkflows = self.blitz.mapping_get_extractable_subworkflows({ 'x-api-key': api_key })
      subworkflows.append({
        'api_key': api_key,
        'subworkflows': extractable_subworkflows
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

    self.logger.info('', self.log_name, 'retrieving extractable workflows')
    extractable_subworkflows = self.__get_extractable_subworkflows(api_keys)
    self.logger.info('', self.log_name, 'finish retrieving extractable workflows')

    for extractable_subworkflow in extractable_subworkflows:
      for subworkflow in extractable_subworkflow['subworkflows']:
        api_key = extractable_subworkflow['api_key']

        workflow = self.blitz.mapping_get_workflow_by_id({ 'x-api-key': api_key }, subworkflow['workflowId'])

        if workflow['status'] == 'inactive':
          self.logger.info(api_key, self.log_name, workflow['name'] + ' is inactive. skipping.')
          continue

        try:
          if subworkflow['integrationType'] == 'smartfile':
            if subworkflow['directionType'] == 'incoming':
              self.logger.info(api_key, self.log_name, 'creating account mapping using smartfile for ' + workflow['name'])
              self.extract_from_smartfile.create_account_mapping(api_key, subworkflow)
              self.logger.info(api_key, self.log_name, 'finish creating account mapping using smartfile for ' + workflow['name'])
            else:
              self.logger.info(api_key, self.log_name, 'creating field mapping using smartfile for ' + workflow['name'])
              self.extract_from_smartfile.create_field_mapping(api_key, subworkflow)
              self.logger.info(api_key, self.log_name, 'finish creating field mapping using smartfile for ' + workflow['name'])

          elif subworkflow['integrationType'] == 'webhook':
            if subworkflow['directionType'] == 'incoming':
              self.logger.info(api_key, self.log_name, 'creating account mapping using webhook for ' + workflow['name'])
              self.extract_from_webhook.create_account_mapping(api_key, subworkflow)
              self.logger.info(api_key, self.log_name, 'finish creating account mapping using webhook for ' + workflow['name'])
            else:
              self.logger.info(api_key, self.log_name, 'creating field mapping using webhook for ' + workflow['name'])
              self.extract_from_webhook.create_field_mapping(api_key, subworkflow)
              self.logger.info(api_key, self.log_name, 'finish creating field mapping using webhook for ' + workflow['name'])

          elif subworkflow['integrationType'] == 'salesforce':
            if subworkflow['directionType'] == 'incoming':
              self.logger.info(api_key, self.log_name, 'creating account mapping using salesforce for ' + workflow['name'])
              self.extract_from_salesforce.create_account_mapping(api_key, subworkflow)
              self.logger.info(api_key, self.log_name, 'finish creating account mapping using salesforce for ' + workflow['name'])
            else:
              self.logger.info(api_key, self.log_name, 'creating field mapping using salesforce for ' + workflow['name'])
              self.extract_from_salesforce.create_field_mapping(api_key, subworkflow)
              self.logger.info(api_key, self.log_name, 'finish creating field mapping using salesforce for ' + workflow['name'])
        except Exception as e:
          self.logger.info(api_key, self.log_name, workflow['name'] + ' encountered an error. skipping. : ' + str(e))
          continue

  def run(self):
    try:
      self.__execute()
      self.__terminate_schedule()
    except Exception as e:
      self.logger.exception('', self.log_name, 'something went wrong : ' + str(e))
      self.__terminate_schedule()

if __name__ == '__main__':
  app = Extract()
  app.run()
