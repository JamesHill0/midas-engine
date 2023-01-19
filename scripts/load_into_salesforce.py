from blitz import Blitz
from rabbitmq import RabbitMQ

class LoadIntoSalesforce:
  def __init__(self):
    self.blitz = Blitz()
    self.mq = RabbitMQ()

  def __create_salesforce_object(self, account_mapping):
    salesforce_object = {}
    for mapping in account_mapping['mappings']:
      salesforce_object[mapping['toFieldName']] = salesforce_object[mapping['toData']]

    return salesforce_object

  def run(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }
    workflow_id = subworkflow['workflowId']

    current_integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])
    workflow_subworkflows = self.blitz.mapping_get_subworkflows_by_workflow_id(headers, workflow_id)

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

    account_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, integration['externalId'])

    for_creation = []
    for_update = []

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'load':
        continue

      salesforce_object = self.__create_salesforce_object(account_mapping)

      if not account_mapping['result']:
        # do create
        for_creation.append(salesforce_object)
      else:
        # do update
        salesforce_id = account_mapping['result']['salesforce_id']
        salesforce_object['Id'] = salesforce_id
        for_update.append(salesforce_object)

      self.mq.publish('blitz-api-mapping', 'accounts.mapping.updated', {
        'apiKey': api_key,
        'id': account_mapping['id'],
        'data': {
          'currentJob': 'done',
        }
      })

    if len(for_creation) > 0:
      self.mq.publish('blitz-api-mapping', 'integrations.salesforce.bulk.created', {
        'apiKey': api_key,
        'integrationId': subworkflow['integrationId'],
        'tableName': subworkflow['tableName'],
        'data': for_creation
      })

    if len(for_update) > 0:
      self.mq.publish('blitz-api-mapping', 'integrations.salesforce.bulk.updated', {
        'apiKey': api_key,
        'integrationId': subworkflow['integrationId'],
        'tableName': subworkflow['tableName'],
        'data': for_update
      })
