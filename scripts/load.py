from blitz import Blitz
from load_into_salesforce import LoadIntoSalesforce

class Load:
  def __init__(self):
    self.log_name = 'load'

    self.blitz = Blitz()

    self.load_into_salesforce = LoadIntoSalesforce()

  def __check_schedule():
    return { 'status': 'inactive' }

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

  def run():
    app_state = self.__check_schedule()

    if app_state['status'] == 'running' or app_state['status'] == 'suspended':
      return

    api_keys = self.__get_accounts_api_keys()
    loadable_subworkflows = self.__get_loadable_subworkflows(api_keys)

    for loadable_subworkflow in loadable_subworkflows:
      for subworkflow in loadable_subworkflow['subworkflows']:
        api_key = loadable_subworkflow['api_key']
