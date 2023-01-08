from blitz import Blitz

class Transform:
  def __init__(self):
    self.log_name = 'transform'

    self.blitz = Blitz()

  def __check_schedule():
    return { 'status': 'inactive' }

  def __get_accounts_api_keys(self):
    accounts = blitz.get_accounts()

    api_keys = []
    for account in accounts:
      api_keys.append(account['apiKey'])

    return api_keys

  def run():
    app_state = self.__check_schedule()

    if app_state['status'] == 'running' or app_state['status'] == 'suspended':
      return

    api_keys = self.__get_accounts_api_keys()
