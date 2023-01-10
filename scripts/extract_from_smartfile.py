from blitz import Blitz
from extract_from_smartfile_mapper import ExtractFromSmartFileMapper
from rabbitmq import RabbitMQ

class ExtractFromSmartFile:
  def __init__(self):
    self.blitz = Blitz()
    self.mapper = ExtractFromSmartFileMapper(True)
    self.mq = RabbitMQ()

  def create_account_mapping(self, api_key, subworkflow):
    files = self.blitz.integration_smart_file_info_list_files({ 'x-api-key': api_key }, subworkflow['integrationId'])
    smartfile_integration = self.blitz.integration_smart_file_get_by_id({ 'x-api-key': api_key }, subworkflow['integrationId'])

    for f in files:
      filename = f['name']
      if f['isfile'] != True and f['mime'] != 'text/html':
        continue

      raw = self.blitz.integration_smart_file_get_data({ 'x-api-key': api_key }, subworkflow['integrationId'], filename)
      if raw['data'] == '':
        continue

      json_Data = self.mapper.to_json(raw['data'])

      mappings = []

      for key in json_data:
        mappings.append({
          'editable': False,
          'fromFieldName': key,
          'toFieldName': '',
          'fromData': json_data[key],
          'toData': ''
        })

      if len(mappings) > 0:
        self.mq.publish('blitz-api-mapping', 'accounts.mapping.created', {
          'apiKey': api_key,
          'account': {
            'name': filename,
            'currentJob': 'extraction'
            'protected': False,
            'externalId': smartfile_integration['externalId'],
            'mappings': mappings
          }
        })

  def create_field_mapping(self, api_key, subworkflow)
    files = self.blitz.integration_smart_file_info_list_files({ 'x-api-key': api_key }, subworkflow['integrationId'])
    smartfile_integration = self.blitz.integration_smart_file_get_by_id({ 'x-api-key': api_key }, subworkflow['integrationId'])

    for f in files:
      filename = f['name']
      if f['isfile'] != True and f['mime'] != 'text/html':
        continue

      raw = self.blitz.integration_smart_file_get_data({ 'x-api-key': api_key }, subworkflow['integrationId'], filename)
      if raw['data'] == '':
        continue

      json_Data = self.mapper.to_json(raw['data'])

      mappings = []

      for key in json_data:
        mappings.append({
          'editable': True,
          'fromFieldName': key,
          'toFieldName': '',
          'fromData': json_data[key],
          'toData': ''
        })

      if len(mappings) > 0:
        self.mq.publish('blitz-api-mapping', 'accounts.mapping.created', {
          'apiKey': api_key,
          'account': {
            'name': filename,
            'currentJob': 'extraction'
            'protected': True,
            'externalId': smartfile_integration['externalId'],
            'mappings': mappings
          }
        })
