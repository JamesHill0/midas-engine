from blitz import Blitz
from rabbitmq import RabbitMQ

class ExtractFromWebhook:
  def __init__(self):
    self.blitz = Blitz()
    self.mq = RabbitMQ()

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

      if len(mappings) > 0:
        self.mq.publish('blitz-api-mapping', 'accounts.mapping.created', {
          'apiKey': api_key,
          'account': {
            'name': external_data['uniqueId'],
            'currentJob': 'extraction'
            'protected': False,
            'externalId': webhook_integration['externalId'],
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

      if len(mappings) > 0:
        self.mq.publish('blitz-api-mapping', 'accounts.mapping.created', {
          'apiKey': api_key,
          'account': {
            'name': external_data['uniqueId'],
            'currentJob': 'extraction'
            'protected': True,
            'externalId': webhook_integration['externalId'],
            'mappings': mappings
          }
        })
