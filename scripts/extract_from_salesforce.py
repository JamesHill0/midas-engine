from blitz import Blitz
from rabbitmq import RabbitMQ
from logger import Logger

class ExtractFromSalesforce:
  def __init__(self):
    self.log_name = 'extract'

    self.blitz = Blitz()
    self.mq = RabbitMQ()

    self.logger = Logger('qa')

  def __create_direct_field_mapping(self, headers, integration, salesforce_fields, workflow):
    externalId = integration['externalId']
    self.logger.info(headers['x-api-key'], self.log_name, 'retrieving existing direct field mapping by external id')
    mapping_type = self.blitz.mapping_get_direct_field_mapping_by_external_id(headers, externalId)
    self.logger.info(headers['x-api-key'], self.log_name, 'successfully retrieved existing direct field mappings'])

    existing_direct_field_mappings = {}
    for mapping in mapping_type:
      existing_direct_field_mappings[mapping['fromField']] = ''

    for salesforce_field in salesforce_fields:
      if existing_direct_field_mappings[salesforce_field['name']]:
        self.logger.info(headers['x-api-key'], self.log_name, 'skipping for creation of direct field mapping since already existed: ' + salesforce_field['name'])
        continue
      else:
        self.logger.info(headers['x-api-key'], self.log_name, 'sending direct field mappings for creation : ' + salesforce_field['name'])
        self.mq.publish('blitz-api-mapping', 'direct.field.mappings.created', {
          'apiKey': headers['x-api-key'],
          'data': {
            'workflowId': workflow['id'],
            'externalId': externalId,
            'fromField': salesforce_field['name']
          }
        })

  def __create_priority_field_mapping(self, headers, integration, salesforce_fields, workflow):
    externalId = integration['externalId']
    self.logger.info(headers['x-api-key'], self.log_name, 'retrieving existing priority field mapping by external id')
    mapping_type = self.blitz.mapping_get_priority_field_mapping_by_external_id(headers, externalId)
    self.logger.info(headers['x-api-key', self.log_name, 'successfully retrieved existing priority field mappings'])

    existing_priority_field_mappings = {}
    for mapping in mapping_type:
      existing_priority_field_mappings[mapping['fromField']] = ''

    for salesforce_field in salesforce_fields:
      if salesforce_field['name'] in existing_priority_field_mappings:
        self.logger.info(headers['x-api-key'], self.log_name, 'skipping for creation of priority field mapping since already existed: ' + salesforce_field['name'])
        continue
      else:
        self.logger.info(headers['x-api-key'], self.log_name, 'sending priority field mappings for creation : ' + salesforce_field['name'])
        self.mq.publish('blitz-api-mapping', 'priority.field.mappings.created', {
          'apiKey': headers['x-api-key'],
          'data': {
            'workflowId': workflow['id'],
            'externalId': externalId,
            'fromField': salesforce_field['name'],
          }
        })

  def __create_data_mapping(self, headers, integration, salesforce_fields, workflow):
    externalId = integration['externalId']
    self.logger.info(headers['x-api-key'], self.log_name, 'retrieving existing data mapping by external id')
    mapping_type = self.blitz.mapping_get_data_mapping_by_external_id(headers, externalId)
    self.logger.info(headers['x-api-key', self.log_name, 'successfully retrieved existing data mappings'])

    existing_data_mappings = {}
    for mapping in mapping_type:
      existing_data_mappings[mapping['toField']] = ''

    for salesforce_field in salesforce_fields:
      if salesforce_field['name'] in existing_data_mappings:
        self.logger.info(headers['x-api-key'], self.log_name, 'skipping for creation of data mapping since already existed: ' + salesforce_field['name'])
        continue
      else:
        self.logger.info(headers['x-api-key'], self.log_name, 'sending data mappings for creation : ' + salesforce_field['name'])
        self.mq.publish('blitz-api-mapping', 'data.mappings.created', {
          'apiKey': headers['x-api-key'],
          'data': {
            'workflowId': workflow['id'],
            'externalId': externalId,
            'toField': salesforce_field['name'],
          }
        })

  def create_account_mapping(self, api_key, subworkflow):
    return

  def create_field_mapping(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }

    self.logger.info(api_key, self.log_name, 'retrieving workflow')
    workflow = self.blitz.mapping_get_workflow_by_id(headers, subworkflow['workflowId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved workflow')

    self.logger.info(api_key, self.log_name, 'retrieving integration')
    integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved integration')

    self.logger.info(api_key, self.log_name, 'retrieving salesforce table fields : ' + subworkflow['tableName'])
    salesforce_fields = self.blitz.integration_salesforce_sf_get_table_fields(headers, subworkflow['integrationId'], subworkflow['tableName'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved salesforce table fields : ' + subworkflow['tableName'])

    if workflow['mappingType'] == 'direct-mapping':
      self.__create_direct_mapping(headers, integration, salesforce_fields, workflow)

    elif workflow['mappingType'] == 'priority-mapping':
      self.__create_priority_field_mapping(headers, integration, salesforce_fields, workflow)

    if workflow['needDataMapping'] == True:
      self.__create_data_mapping(headers, integration, salesforce_fields, workflow)
