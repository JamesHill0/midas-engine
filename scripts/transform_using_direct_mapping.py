from blitz import Blitz
from rabbitmq import RabbitMQ
from logger import Logger

class TransformUsingDirectMapping:
  def __init__(self):
    self.log_name = 'transform'
    self.blitz = Blitz()
    self.mq = RabbitMQ()

    self.logger = Logger('qa')

  def run(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }
    self.logger.info(api_key, self.log_name, 'retrieving salesforce integration')
    current_integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved salesforce integration : ' + current_integration['externalId'])

    self.logger.info(api_key, self.log_name, 'retrieving existing direct field mapping : ' + current_integration['externalId'])
    direct_field_mappings = self.blitz.mapping_get_direct_field_mapping_by_external_id(headers, current_integration['externalId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved direct field mapping : ' + current_integration['externalId'])

    dfm = {}
    for direct_field_mapping in direct_field_mappings:
      dfm[direct_field_mapping['toField']] = direct_field_mapping['fromField']

    if not dfm:
      return

    self.logger.info(api_key, self.log_name, 'retrieving account mappings : ' + current_integration['externalId'])
    account_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, current_integration['externalId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved account mappings : ' + current_integration['externalId'])

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'transformation':
        continue

      for mapping in account_mapping['mappings']:
        if mapping['fromField'] in dfm:
          self.logger.info(api_key, self.log_name, 'sending direct mapping for update : ' + mapping['fromField'] + ' -> ' + dfm[mapping['fromField']])
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
