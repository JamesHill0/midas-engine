from blitz import Blitz

class LoadIntoSalesForce:
  def __init__(self):
    self.blitz = Blitz()

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
      if workflow_subworkflow['jobType'] == 'extraction' and workflow_subworkflow['direction'] == 'incoming':
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

    for account_mapping in account_mappings:
      salesforce_object = self.__create_salesforce_object(account_mapping)

      if account_mapping['result']:
        # do create
      else:
        # do update
