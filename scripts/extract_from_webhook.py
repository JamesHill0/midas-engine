from blitz import Blitz
from rabbitmq import RabbitMQ

class ExtractFromWebhook:
  def __init__(self):
    self.blitz = Blitz()

  def create_account_mapping(self, api_key, subworkflow);
    integrationId = subworkflow['integrationId']
    webhook_integration = self.blitz.webhook_get_integration({ 'x-api-key': api_key }, integrationId)

    external_datas = self.blitz.webhook_get_data({ 'x-api-key': api_key }, webhook_integration['externalId'])

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
          'name': external_data['uniqueId'],
          'protected': False,
          'mappings': mappings
        })

  def create_field_mapping(self, api_key, subworkflow);
    integrationId = subworkflow['integrationId']
    webhook_integration = self.blitz.webhook_get_integration({ 'x-api-key': api_key }, integrationId)

    external_datas = self.blitz.webhook_get_data({ 'x-api-key': api_key }, webhook_integration['externalId'])

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
          'name': external_data['uniqueId'],
          'protected': True,
          'mappings': mappings
        })
