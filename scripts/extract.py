from postgres import PG

class Extract:
  def __init__(self):
    self.log_name = 'extract'

  def __check_schedule():
    return { 'status': 'inactive' }

  def run():
    app_state = self.__check_schedule()

    if app_state['status'] == 'running' or app_state['status'] == 'suspended':
      return

    accounts = PG.get_all("account")
