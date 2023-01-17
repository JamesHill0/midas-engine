from blitz import Blitz
from rabbitmq import RabbitMQ

class ExtractFromSalesforce:
  def __init__(self):
    self.blitz = Blitz()
    self.mq = RabbitMQ()

  def __create_direct_field_mapping(self, headers, integration, salesforce_fields, workflow):
    externalId = integration['externalId']
    mapping_type = self.blitz.mapping_get_direct_field_mapping_by_external_id(headers, externalId)

    existing_direct_field_mappings = {}
    for mapping in mapping_type:
      existing_direct_field_mappings[mapping['fromField']] = mapping['toField']

    for salesforce_field in salesforce_fields:
      if existing_direct_field_mappings[salesforce_field['name']]:
        continue
      else:
        self.mq.publish('blitz-api-mapping', 'direct.field.mappings.created', {
          'apiKey': api_key,
          'data': {
            'workflowId': workflow['id'],
            'externalId': externalId,
            'fromField': salesforce_field['name'],
            'toField': ''
          }
        })

  def __create_priority_field_mapping(self, headers, integration, salesforce_fields, workflow):
    externalId = integration['externalId']
    mapping_type = self.blitz.mapping_get_priority_field_mapping_by_external_id(headers, externalId)

    existing_priority_field_mappings = {}
    for mapping in mapping_type:
      existing_priority_field_mappings[mapping['fromField']] = mapping['toField']

    for salesforce_field in salesforce_fields:
      if existing_priority_field_mappings[salesforce_field['name']]:
        continue
      else:
        self.mq.publish('blitz-api-mapping', 'priority.field.mappings.created', {
          'apiKey': api_key,
          'data': {
            'workflowId': workflow['id'],
            'externalId': externalId,
            'fromField': salesforce_field['name'],
            'toField': ''
          }
        })

  def __create_data_mapping(self, headers, integration, salesforce_fields, workflow):
    externalId = integration['externalId']
    mapping_type = self.blitz.mapping_get_data_mapping_by_external_id(headers, externalId)

    existing_data_mappings = {}
    for mapping in mapping_type:
      existing_data_mappings[mapping['toField']] = mapping['toField']

    for salesforce_field in salesforce_fields:
      if existing_data_mappings[salesforce_field['name']]:
        continue
      else:
        self.mq.publish('blitz-api-mapping', 'data.mappings.created', {
          'apiKey': api_key,
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
    workflow = self.blitz.mapping_get_workflow_by_id(headers, subworkflow['workflowId'])

    integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])

    salesforce_fields = self.blitz.integration_salesforce_sf_get_one(headers, subworkflow['integrationId'], subworkflow['tableName'])

    if workflow['mappingType'] == 'direct-mapping':
      self.__create_direct_mapping(headers, integration, salesforce_fields, workflow)

    elif workflow['mappingType'] == 'priority-mapping':
      self.__create_priority_field_mapping(headers, integration, salesforce_fields, workflow)

    if workflow['needDataMapping'] == True:
      self.__create_data_mapping(headers, integration, salesforce_fields, workflow)
