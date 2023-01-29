from blitz import Blitz
from rabbitmq import RabbitMQ
from logger import Logger

class TransformUsingPriorityMapping:
  def __init__(self):
    self.log_name = 'transform'
    self.blitz = Blitz()
    self.mq = RabbitMQ()

    self.logger = Logger('qa')

  def run(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }
    self.logger.info(api_key, self.log_name, 'retrieving integrations')
    integrations = self.blitz.integration_get_integrations(headers)
    self.logger.info(api_key, self.log_name, 'successfully retrieved integrations')

    current_integration = {}
    for integration in integrations:
      if str(integration['id']) == subworkflow['integrationId'] and integration['name'].lower() == subworkflow['integrationType'].lower():
        current_integration = integration
        break

    self.logger.info(api_key, self.log_name, 'retrieving existing priority field mapping')
    priority_field_mappings = self.blitz.mapping_get_priority_field_mapping_by_workflow_id(headers, subworkflow['workflowId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved existing priority field mapping')

    self.logger.info(api_key, self.log_name, 'retrieving account mappings : ' + current_integration['externalId'])
    account_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, current_integration['externalId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved account mappings : ' + current_integration['externalId'])

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'transform':
        continue

      for mapping in account_mapping['mappings']:
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
              self.logger.info(api_key, self.log_name, 'sending priority mapping for update : ' + mapping['fromField'] + ' -> ' + priority_field_mapping['fromField'])
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
