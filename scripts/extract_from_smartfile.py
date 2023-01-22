from blitz import Blitz
from extract_from_smartfile_mapper import ExtractFromSmartFileMapper
from rabbitmq import RabbitMQ

from env import Env
import requests

class ExtractFromSmartFile:
  def __init__(self):
    self.blitz = Blitz()
    self.env = Env()
    self.mapper = ExtractFromSmartFileMapper(True)
    self.mq = RabbitMQ()

  def __check_if_account_mapping_is_existing(self, headers, name):
    account_mapping = self.blitz.mapping_get_account_mapping_by_name(headers, name)
    return account_mapping

  def create_account_mapping(self, api_key, subworkflow):
    headers = { 'x-api_key': api_key }
    files = self.blitz.integration_smart_file_info_list_files(headers, subworkflow['integrationId'])
    current_integration = self.blitz.integration_smart_file_get_by_id(headers, subworkflow['integrationId'])

    if not files:
      return

    files = files[0]

    for f in files:
      filename = f['name']

      if f['isfile'] != True and f['mime'] != 'text/html':
        continue

      authentication_result = self.blitz.authentication_decrypt(current_integration['secret']['key'])
      smart_file_url = self.env.smart_file_url() + '/path/data/' + current_integration['secret']['directory'] + '/' + f['name']
      smart_file_headers = { 'Authorization': 'Basic ' + authentication_result['encoded'] }
      smart_file_result = requests.get(smart_file_url, headers=smart_file_headers)

      if smart_file_result == '':
        continue

      json_data = self.mapper.to_json(f['name'], smart_file_result)

      mappings = []

      for key in json_data.keys():
        if key == '' or json_data[key] == '' or not key or not json_data[key]:
          continue

        if isinstance(json_data[key], (dict, list)):
          continue

        mappings.append({
          'editable': False,
          'fromField': key,
          'toField': '',
          'fromData': str(json_data[key]),
          'toData': ''
        })

      name = current_integration['externalId'] + '-' + filename
      if len(mappings) > 0:
        account_mapping = self.__check_if_account_mapping_is_existing(headers, name)

        if len(account_mapping) == 0:
          existing_account_mapping = account_mapping[0]
          if existing_account_mapping['currentJob'] == 'extraction':

            data = {}
            for mapping in existing_account_mapping['mappings']:
              data.append({ 'id': mapping['id'] })

            self.mq.publish('blitz-api-mapping', 'mappings.deleted', {
              'apiKey': api_key,
              'data': data
            })

            self.mq.publish('blitz-api-mapping', 'accounts.mappings.updated', {
              'apiKey': api_key,
              'id': existing_account_mapping['id'],
              'data': {
                'currentJob': 'pre-transformation',
                'mappings': mappings
              }
            })
        else:
          self.mq.publish('blitz-api-mapping', 'accounts.mappings.created', {
            'apiKey': api_key,
            'data': {
              'name': name,
              'currentJob': 'pre-transformation',
              'protected': False,
              'workflowId': subworkflow['workflowId'],
              'externalId': current_integration['externalId'],
              'mappings': mappings
            }
          })

  def create_field_mapping(self, api_key, subworkflow):
    return
