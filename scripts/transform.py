from blitz import Blitz
from transform_using_direct_mapping import TransformUsingDirectMapping
from transform_using_priority_mapping import TransformUsingPriorityMapping
from transform_using_data_mapping import TransformUsingDataMapping
from logger import Logger
import datetime

class Transform:
  def __init__(self):
    self.log_name = 'transform'

    self.blitz = Blitz()

    self.transform_using_direct_mapping = TransformUsingDataMapping()
    self.transform_using_priority_mapping = TransformUsingPriorityMapping()
    self.transform_using_data_mapping = TransformUsingDataMapping()

    self.logger = Logger()

  def __check_schedule():
    data = self.blitz.account_get_jobs_by_name('extract')
    if data['status'] == 'running':
      updated_date = datetime.datetime.strptime(data['Updated'], "%d%m%Y").date()
      if (datetime.now() - updated_date).minutes > 60:
        self.blitz.account_update_job(data['id'], { 'status': 'inactive' })
    return data

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

    self.logger.info('', self.log_name, 'retrieving all accounts')
    api_keys = self.__get_accounts_api_keys()
    self.logger.info('', self.log_name, 'finish retrieving all accounts')

    self.logger.info('', self.log_name, 'retrieving transformable workflows')
    transformable_subworkflows = self.__get_transformable_subworkflows(api_keys)
    self.logger.info('', self.log_name, 'finish retrieving transformable workflows')

    for transformable_subworkflow in transformable_subworkflows:
      for subworkflow in transformable_subworkflow['subworkflows']:
        api_key = transformable_subworkflow['api_key']
        workflow = self.blitz.mapping_get_workflow({ 'x-api-key': api_key}, subworkflow['workflowId'])

        if workflow['mappingType'] == 'direct-mapping':
          self.logger.info(api_key, self.log_name, 'transforming field using direct mapping for workflow ' + workflow['name'])
          self.transform_using_data_mapping.run(api_key, subworkflow)
          self.logger.info(api_key, self.log_name, 'finish transforming field using direct mapping for workflow ' + workflow['name'])

        elif workflow['mappingType'] == 'priority-mapping':
          self.logger.info(api_key, self.log_name, 'transforming field using priority mapping for workflow ' + workflow['name'])
          self.transform_using_priority_mapping.run(api_key, subworkflow)
          self.logger.info(api_key, self.log_name, 'finish transforming field using priority mapping for workflow ' + workflow['name'])

        if workflow['needDataMapping'] == True:
          self.logger.info(api_key, self.log_name, 'transforming data using data mapping for workflow ' + workflow['name'])
          self.transform_using_data_mapping.run(api_key, subworkflow)
          self.logger.info(api_key, self.log_name, 'finish transforming data using data mapping for workflow ' + workflow['name'])

  def run(self):
    try:
      self.__execute()
    except:
      self.logger.exception('', self.log_name, 'something went wrong')

if __name__ == '__main__':
  app = Transform()
  app.run()
