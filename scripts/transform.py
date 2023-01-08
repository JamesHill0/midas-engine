from blitz import Blitz
from transform_using_direct_mapping import TransformUsingDirectMapping
from transform_using_priority_mapping import TransformUsingPriorityMapping
from transform_using_data_mapping import TransformUsingDataMapping

class Transform:
  def __init__(self):
    self.log_name = 'transform'

    self.blitz = Blitz()

    self.transform_using_direct_mapping = TransformUsingDataMapping()
    self.transform_using_priority_mapping = TransformUsingPriorityMapping()
    self.transform_using_data_mapping = TransformUsingDataMapping()

  def __check_schedule():
    return { 'status': 'inactive' }

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

  def run():
    app_state = self.__check_schedule()

    if app_state['status'] == 'running' or app_state['status'] == 'suspended':
      return

    api_keys = self.__get_accounts_api_keys()
    transformable_subworkflows = self.__get_transformable_subworkflows(api_keys)

    for transformable_subworkflow in transformable_subworkflows:
      for subworkflow in transformable_subworkflow['subworkflows']:
        api_key = transformable_subworkflow['api_key']
        workflow = self.blitz.mapping_get_workflow({ 'x-api-key': api_key}, subworkflow['workflowId'])

        if workflow['mappingType'] == 'direct-mapping':
          self.transform_using_data_mapping.update_account_mapping(api_key, subworkflow)

        else if workflow['mappingType'] == 'priority-mapping':
          self.transform_using_priority_mapping.update_account_mapping(api_key, subworkflow)

        if workflow['needDataMapping'] == True:
          self.transform_using_data_mapping.update_account_mapping(api_key, subworkflow)
