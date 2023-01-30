from blitz import Blitz
from rabbitmq import RabbitMQ
from logger import Logger

class TransformRemoveMapping:
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

    self.logger.info(api_key, self.log_name, 'retrieving account mappings : ' + current_integration['externalId'])
    account_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, current_integration['externalId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved account mappings : ' + current_integration['externalId'])

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'transform':
        continue

      for mapping in account_mapping['mappings']:
        if mapping['toData'] != '' or mapping['toField'] != '':
          self.logger.info(api_key, self.log_name, 'removing existing mappings : ' + mapping['fromField'])
          self.mq.publish('blitz-api-mapping', 'mappings.updated', {
            'apiKey': api_key,
            'id': mapping['id'],
            'data': {
              'toData': '',
              'toField': ''
            }
          })
