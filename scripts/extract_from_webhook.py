from blitz import Blitz
from rabbitmq import RabbitMQ

class ExtractFromWebhook:
  def __init__(self):
    self.blitz = Blitz()
    self.mq = RabbitMQ()

  def __check_if_account_mapping_is_existing(self, headers, name):
    account_mapping = self.blitz.mapping_get_account_mapping_by_name(headers, name)
    return account_mapping

  def create_account_mapping(self, api_key, subworkflow);
    headers = { 'x-api-key': api_key }
    integrationId = subworkflow['integrationId']
    webhook_integration = self.blitz.integration_webhook_get_by_id(headers, integrationId)

    external_datas = self.blitz.integration_webhook_get_data(headers, webhook_integration['externalId'])

    for external_data in external_datas:
      mappings = []
      data = external_data['data']
      for key in data:
        mappings.append({
          'editable': False,
          'fromFieldName': key,
          'toFieldName': '',
          'fromData': data[key],
          'toData': ''
        })

      name = current_integration['uniqueId']
      if len(mappings) > 0:
        account_mapping = self.__check_if_account_mapping_is_existing(headers, name):

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
              'currentJob': 'pre-transformation'
              'protected': False,
              'externalId': current_integration['externalId'],
              'mappings': mappings
            }
          })

  def create_field_mapping(self, api_key, subworkflow);
    headers = { 'x-api-key': api_key }
    integrationId = subworkflow['integrationId']
    webhook_integration = self.blitz.integration_webhook_get_by_id(headers, integrationId)

    external_datas = self.blitz.integration_webhook_get_data(headers, webhook_integration['externalId'])

    for external_data in external_datas:
      mappings = []
      data = external_data['data']
      for key in data:
        mappings.append({
          'editable': True,
          'fromFieldName': key,
          'toFieldName': '',
          'fromData': data[key],
          'toData': ''
        })

      name = current_integration['uniqueId']
      if len(mappings) > 0:
        account_mapping = self.__check_if_account_mapping_is_existing(headers, name):

        if account_mapping:
          if account_mapping['currentJob'] == 'extraction'

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
              'currentJob': 'pre-transformation'
              'protected': True,
              'externalId': current_integration['externalId'],
              'mappings': mappings
            }
          })
