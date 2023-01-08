from blitz import Blitz
from mapper import Mapper
from extract_from_smartfile import ExtractFromSmartFile
from extract_from_webhook import ExtractFromWebhook

class Extract:
  def __init__(self):
    self.log_name = 'extract'

    self.blitz = Blitz()
    self.mapper = Mapper(True)

    self.extract_from_smartfile = ExtractFromSmartFile()
    self.extract_from_webhook = ExtractFromWebhook()

  def __check_schedule():
    return { 'status': 'inactive' }

  def __get_accounts_api_keys(self):
    accounts = blitz.get_accounts()

    api_keys = []
    for account in accounts:
      api_keys.append(account['apiKey'])

    return api_keys

  def __get_extractable_subworkflows(self):
    subworkflows = []
    for api_key in api_keys:
      extractable_subworkflows = self.blitz.get_extractable_subworkflows({ 'x-api-key': api_key })
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
    extractable_subworkflows = self.__get_extractable_subworkflows(api_keys)

    for extractable_subworkflow in extractable_subworkflows:
      for subworkflow in extractable_subworkflow['subworkflows']:
        api_key = extractable_subworkflow['api_key']

        if subworkflow['integrationType'] == 'smartfile':
          if subworkflow['direction'] == 'incoming':
            self.extract_from_smartfile.create_account_mapping(api_key, subworkflow)
          else
            self.extract_from_smartfile.create_field_mapping(api_key, subworkflow)

        else if subworkflow['integrationType'] == 'webhook':
          if subworkflow['direction'] == 'incoming':
            self.extract_from_webhook.create_account_mapping(api_key, subworkflow)
          else
            self.extract_from_webhook.create_field_mapping(api_key, subworkflow)
