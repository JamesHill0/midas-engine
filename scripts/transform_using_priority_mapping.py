from blitz import Blitz
from rabbitmq import RabbitMQ

class TransformUsingPriorityMapping:
  def __init__(self):
    self.blitz = Blitz()
    self.mq = RabbitMQ()

  def run(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }
    current_integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])

    priority_field_mappings = self.blitz.mapping_get_priority_field_mapping_by_external_id(headers, subworkflow['integrationId'])
    accounts_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, current_integration['externalId'])

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'transformation':
        continue

      for mapping in account_mappings['mappings']:
        if mapping['fromData'] == '':
          continue

        for priority_field_mapping in priority_field_mappings:
          pfmv = {}
          for priority_field_mapping_value in priority_field_mapping['values']:
            pfmv[priority_field_mapping_value['toField']] = priority_field_mapping_value['level']

          if not pfmv:
            continue

          sortedPfmv = sorted(pfmv)

          mapping_updated = False
          for value in sortedPfmv:
            if value == mapping['fromField']:
              self.mq.publish('blitz-api-mapping', 'mappings.updated', {
                'apiKey': api_key,
                'id': mapping['id'],
                'data': {
                  'toField': priority_field_mapping['fromField']
                }
              })

              mapping_updated = True
              break

          if mapping_updated:
            break

      self.mq.publish('blitz-api-mapping', 'accounts.mapping.updated', {
        'apiKey': api_key,
        'id': account_mapping['id'],
        'data': {
          'currentJob': 'load'
        }
      })
