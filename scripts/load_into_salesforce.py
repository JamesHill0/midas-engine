from blitz import Blitz
from rabbitmq import RabbitMQ
from logger import Logger
import json

class LoadIntoSalesforce:
  def __init__(self):
    self.log_name = 'load'
    self.blitz = Blitz()
    self.mq = RabbitMQ()

    self.logger = Logger('qa')

  def __create_salesforce_object(self, account_mapping):
    salesforce_object = {}
    for mapping in account_mapping['mappings']:
      if mapping['toField'] == '':
        continue

      if mapping['toData'] == '':
        salesforce_object[mapping['toField']] = mapping['fromData']
      else:
        salesforce_object[mapping['toField']] = mapping['toData']

    return salesforce_object

  def run(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }
    workflow_id = subworkflow['workflowId']

    self.logger.info(api_key, self.log_name, 'retrieving salesforce integration')
    current_integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])
    self.logger.info(api_key, self.log_name, 'successfully retrived salesforce integration : ' + current_integration['externalId'])

    self.logger.info(api_key, self.log_name, 'retrieving subworkflows by workflow')
    workflow_subworkflows = self.blitz.mapping_get_subworkflows_by_workflow_id(headers, workflow_id)
    self.logger.info(api_key, self.log_name, 'successfully retrieved subworkflows by workflow')

    integration = {}
    for workflow_subworkflow in workflow_subworkflows:
      if workflow_subworkflow['jobType'] == 'extraction' and workflow_subworkflow['directionType'] == 'incoming':
        integration_id = workflow_subworkflow['integrationId']

        if workflow_subworkflow['integrationType'] == 'smartfile':
          integration = self.blitz.integration_smart_file_get_by_id(headers, integration_id)
        elif workflow_subworkflow['integrationType'] == 'salesforce':
          integration = self.blitz.integration_salesforce_get_by_id(headers, integration_id)
        elif workflow_subworkflow['integrationType'] == 'webhook':
          integration = self.blitz.integration_webhook_get_by_id(headers, integration_id)
      else:
        continue

    if not integration:
      return

    self.logger.info(api_key, self.log_name, 'retrieving account mappings : ' + integration['externalId'])
    account_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, integration['externalId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved account mappings : ' + integration['externalId'])

    if not account_mappings:
      return

    for_creation = []
    for_create_account_mapping_ids = []

    for_update = []
    for_update_sf_ids = []
    for_update_account_mapping_ids = []

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'load':
        continue

      self.logger.info(api_key, self.log_name, 'creating a salesforce object using account mapping')
      salesforce_object = self.__create_salesforce_object(account_mapping)
      self.logger.info(api_key, self.log_name, 'successfully created as salesforce object using account mapping')

      result = {}
      if account_mapping['result']:
        result = json.loads(account_mapping['result'])

      if 'id' in result:
        # do update
        self.logger.info(api_key, self.log_name, 'adding salesforce object for update: ' + result['id'])
        salesforce_id = result['id']
        salesforce_object['Id'] = salesforce_id
        for_update_account_mapping_ids.append(account_mapping['id'])
        for_update_sf_ids.append(salesforce_id)
        for_update.append(salesforce_object)
        self.logger.info(api_key, self.log_name, 'successfully added salesforce object for update: ' + result['id'])
      else:
        # do create
        self.logger.info(api_key, self.log_name, 'adding salesforce object for creation')
        for_create_account_mapping_ids.append(account_mapping['id'])
        for_creation.append(salesforce_object)
        self.logger.info(api_key, self.log_name, 'successfully added salesforce object for creation')

      self.mq.publish('blitz-api-mapping', 'accounts.mappings.updated', {
        'apiKey': api_key,
        'id': account_mapping['id'],
        'data': {
          'currentJob': 'post-load',
        }
      })

    if len(for_creation) > 0:
      self.logger.info(api_key, self.log_name, 'sending request to salesforce integration for bulk creation')
      self.mq.publish('blitz-api-integration', 'integrations.salesforce.bulk.created', {
        'apiKey': api_key,
        'integrationId': subworkflow['integrationId'],
        'tableName': subworkflow['tableName'],
        'account_mapping_ids': for_create_account_mapping_ids,
        'data': for_creation
      })

    if len(for_update) > 0:
      self.logger.info(api_key, self.log_name, 'sending request to salesforce integration for bulk update')
      self.mq.publish('blitz-api-integration', 'integrations.salesforce.bulk.updated', {
        'apiKey': api_key,
        'integrationId': subworkflow['integrationId'],
        'tableName': subworkflow['tableName'],
        'account_mapping_ids': for_update_account_mapping_ids,
        'existing_sf_ids': for_update_sf_ids,
        'data': for_update
      })
