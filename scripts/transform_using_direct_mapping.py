from blitz import Blitz
from rabbitmq import RabbitMQ

class TransformUsingDirectMapping:
  def __init__(self):
    self.blitz = Blitz()
    self.mq = RabbitMQ()

  def run(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }
    current_integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])

    direct_field_mappings = self.blitz.mapping_get_direct_field_mapping_by_external_id(headers, current_integration['externalId'])

    dfm = {}
    for direct_field_mapping in direct_field_mappings:
      dfm[direct_field_mapping['toField']] = direct_field_mapping['fromField']

    if not dfm:
      return

    accounts_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, current_integration['externalId'])
    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'transformation':
        continue

      for mapping in account_mapping['mappings']:
        if mapping['fromField'] in dfm:
          self.mq.publish('blitz-api-mapping', 'mappings.updated', {
            'apiKey': api_key,
            'id': mapping['id'],
            'data': {
              'toField': dfm[mapping['fromField']]
            }
          })

      self.mq.publish('blitz-api-mapping', 'accounts.mapping.updated', {
        'apiKey': api_key,
        'id': account_mapping['id'],
        'data': {
          'currentJob': 'load'
        }
      })
