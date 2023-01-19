from blitz import Blitz
from extract_from_smartfile_mapper import ExtractFromSmartFileMapper
from rabbitmq import RabbitMQ

class ExtractFromSmartFile:
  def __init__(self):
    self.blitz = Blitz()
    self.mapper = ExtractFromSmartFileMapper(True)
    self.mq = RabbitMQ()

  def __check_if_account_mapping_is_existing(self, headers, name):
    account_mapping = self.blitz.mapping_get_account_mapping_by_name(headers, name)
    return account_mapping

  def create_account_mapping(self, api_key, subworkflow):
    headers = { 'x-api_key': api_key }
    files = self.blitz.integration_smart_file_info_list_files(headers, subworkflow['integrationId'])
    current_integration = self.blitz.integration_smart_file_get_by_id(headers, subworkflow['integrationId'])

    print(files)

    if not files:
      return

    for f in files:
      filename = f['name']

      if f['isfile'] != True and f['mime'] != 'text/html':
        continue

      raw = self.blitz.integration_smart_file_get_data(headers, subworkflow['integrationId'], filename)
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

      name = current_integration['externalId'] + '-' + filename
      if len(mappings) > 0:
        account_mapping = self.__check_if_account_mapping_is_existing(headers, name)

        if account_mapping:
          if account_mapping['currentJob'] == 'extraction':

            data = {}
            for mapping in account_mapping['mappings']:
              data.append({ 'id': mapping['id'] })

            self.mq.publish('blitz-api-mapping', 'mappings.deleted', {
              'apiKey': api_key,
              'data': data
            })

            self.mq.publish('blitz-api-mapping', 'accounts.mapping.updated', {
              'apiKey': api_key,
              'id': account_mapping['id'],
              'data': {
                'currentJob': 'pre-transformation',
                'mappings': mappings
              }
            })
        else:
          self.mq.publish('blitz-api-mapping', 'accounts.mapping.created', {
            'apiKey': api_key,
            'data': {
              'name': name,
              'currentJob': 'pre-transformation',
              'protected': False,
              'externalId': current_integration['externalId'],
              'mappings': mappings
            }
          })

  def create_field_mapping(self, api_key, subworkflow):
    return
