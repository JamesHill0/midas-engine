from blitz import Blitz

class Extract:
  def __init__(self):
    self.log_name = 'extract'

  def __check_schedule():
    return { 'status': 'inactive' }

  def __get_accounts_api_keys():
    accounts = blitz.get_accounts()

    api_keys = []
    for account in accounts:
      api_keys.append(account['apiKey'])

    return api_keys

  def __get_subworkflows():
    subworkflows = []
    for api_key in api_keys:
      extractable_subworkflows = blitz.get_extractable_subworkflows({ 'x-api-key': api_key })
      subworkflows.append({
        'api_key': api_key,
        'subworkflows': extractable_subworkflows
      })

    return subworkflows

  def run():
    app_state = self.__check_schedule()

    if app_state['status'] == 'running' or app_state['status'] == 'suspended':
      return

    api_keys = self.__get_accounts_api_keys()
    subworkflows = self.__get_subworkflows(api_keys)

    for subworkflow in subworkflows:
