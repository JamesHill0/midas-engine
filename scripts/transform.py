from blitz import Blitz
from transform_using_direct_mapping import TransformUsingDirectMapping
from transform_using_priority_mapping import TransformUsingPriorityMapping
from transform_using_data_mapping import TransformUsingDataMapping
from transform_remove_mapping import TransformRemoveMapping
from rabbitmq import RabbitMQ
from logger import Logger

from dateutil.parser import parse
from datetime import datetime, timezone

class Transform:
  def __init__(self):
    self.log_name = 'transform'

    self.blitz = Blitz()
    self.mq = RabbitMQ()

    self.transform_remove_mapping = TransformRemoveMapping()
    self.transform_using_direct_mapping = TransformUsingDataMapping()
    self.transform_using_priority_mapping = TransformUsingPriorityMapping()
    self.transform_using_data_mapping = TransformUsingDataMapping()

    self.logger = Logger('qa')

  def __check_schedule(self):
    datas = self.blitz.account_get_jobs_by_name('transform')

    data = datas[0]
    if data['status'] == 'running':
      self.logger.info('', self.log_name, 'job is still running. checking again later')
      updated_date = parse(data['updated'])
      result_date = datetime.now() - updated_date.replace(tzinfo=None)
      if (result_date.days) > 0:
        self.blitz.account_update_job(data['id'], { 'status': 'inactive' })
      return { 'status': 'suspended' }

    self.blitz.account_update_job(data['id'], { 'status': 'running' })
    return data

  def __terminate_schedule(self):
    datas = self.blitz.account_get_jobs_by_name('transform')

    data = datas[0]
    self.logger.info('', self.log_name, 'job finished running')
    self.blitz.account_update_job(data['id'], { 'status': 'inactive' })

  def __get_accounts_api_keys(self):
    accounts = self.blitz.account_get_accounts()

    api_keys = []
    for account in accounts:
      api_keys.append(account['apiKey'])

    return api_keys

  def __get_transformable_subworkflows(self, api_keys):
    subworkflows = []
    for api_key in api_keys:
      transformable_subworkflows = self.blitz.mapping_get_transformable_subworkflows({ 'x-api-key': api_key })
      subworkflows.append({
        'api_key': api_key,
        'subworkflows': transformable_subworkflows
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

    self.logger.info('', self.log_name, 'retrieving transformable workflows')
    transformable_subworkflows = self.__get_transformable_subworkflows(api_keys)
    self.logger.info('', self.log_name, 'finish retrieving transformable workflows')

    for transformable_subworkflow in transformable_subworkflows:
      for subworkflow in transformable_subworkflow['subworkflows']:
        api_key = transformable_subworkflow['api_key']
        workflow = self.blitz.mapping_get_workflow_by_id({ 'x-api-key': api_key}, subworkflow['workflowId'])

        if workflow['status'] == 'inactive':
          self.logger.info(api_key, self.log_name, workflow['name'] + ' is inactive. skipping.')
          continue

        account = {}
        try:
          self.logger.info(api_key, self.log_name, 'cleaning up before transforming for workflow ' + workflow['name'])
          self.transform_remove_mapping.run(api_key, subworkflow)
          self.logger.info(api_key, self.log_name, 'finish cleaning up transformed data for workflow ' + workflow['name'])

          if workflow['mappingType'] == 'direct-mapping':
            self.logger.info(api_key, self.log_name, 'transforming field using direct mapping for workflow ' + workflow['name'])
            accounts = self.transform_using_data_mapping.run(api_key, subworkflow)
            self.logger.info(api_key, self.log_name, 'finish transforming field using direct mapping for workflow ' + workflow['name'])
          elif workflow['mappingType'] == 'priority-mapping':
            self.logger.info(api_key, self.log_name, 'transforming field using priority mapping for workflow ' + workflow['name'])
            accounts = self.transform_using_priority_mapping.run(api_key, subworkflow)
            self.logger.info(api_key, self.log_name, 'finish transforming field using priority mapping for workflow ' + workflow['name'])

          if workflow['needDataMapping'] == True:
            self.logger.info(api_key, self.log_name, 'transforming data using data mapping for workflow ' + workflow['name'])
            account = self.transform_using_data_mapping.run(api_key, subworkflow)
            self.logger.info(api_key, self.log_name, 'finish transforming data using data mapping for workflow ' + workflow['name'])
        except Exception as e:
          self.logger.info(api_key, self.log_name, workflow['name'] + ' encountered an error. skipping. : ' + str(e))
          continue

        for account in accounts:
          if not accounts:
            self.logger.info(api_key, self.log_name, 'was not able to transform account successfully: ' + account['name'])
          else:
            self.logger.info(api_key, self.log_name, 'sending account for update to load: ' + account['name'])
            self.mq.publish('blitz-api-mapping', 'accounts.mappings.updated', account['data'])

  def run(self):
    try:
      self.__execute()
      self.__terminate_schedule()
    except Exception as e:
      self.logger.exception('', self.log_name, 'something went wrong : ' + str(e))
      self.__terminate_schedule()

if __name__ == '__main__':
  app = Transform()
  app.run()
