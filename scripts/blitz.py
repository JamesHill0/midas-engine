from env import Env

import requests
import json

class Blitz:
  def __init__(self):
    e = Env()

    self.base_url = e.backend_api_base_url()

  def __get_response(self, url, headers):
    response = requests.get(url, headers=headers)
    if 'data' in response.json():
      return response.json()['data']

  def __update(self, url, body):
    response = requests.patch(url, json=body)
    if 'data' in response.json():
      return response.json()['data']

  def __post(self, url, body):
    response = requests.post(url, json=body)
    if 'data' in response.json():
      return response.json()['data']

  def authentication_decrypt(self, for_decryption):
    url = self.base_url + '/authentication/auth/decrypt'
    return self.__post(url, { "token": for_decryption })

  def account_get_accounts(self):
    url = self.base_url + '/account/accounts'
    return self.__get_response(url, {})

  def account_get_jobs_by_name(self, name):
    url = self.base_url + '/account/jobs?q_name=' + str(name)
    return self.__get_response(url, {})

  def account_update_job(self, id, body):
    url = self.base_url + '/account/jobs/' + str(id)
    return self.__update(url, body)

  def mapping_get_account_mapping_by_name(self, headers, name):
    url = self.base_url + '/mapping/accounts?q_name=' + str(name)
    return self.__get_response(url, headers)

  def mapping_get_account_mapping_by_external_id(self, headers, external_id):
    url = self.base_url + '/mapping/accounts?q_externalId=' + str(external_id)
    return self.__get_response(url, headers)

  def mapping_get_direct_field_mapping_by_external_id(self, headers, external_id):
    url = self.base_url + '/mapping/direct-field-mappings?q_externalId=' + str(external_id)
    return self.__get_response(url, headers)

  def mapping_get_direct_field_mapping_by_workflow_id(self, headers, workflow_id):
    url = self.base_url + '/mapping/direct-field-mappings?q_workflowId=' + str(workflow_id)
    return self.__get_response(url, headers)

  def mapping_get_priority_field_mapping_by_external_id(self, headers, external_id):
    url = self.base_url + '/mapping/priority-field-mappings?q_externalId=' + str(external_id)
    return self.__get_response(url, headers)

  def mapping_get_priority_field_mapping_by_workflow_id(self, headers, workflow_id):
    url = self.base_url + '/mapping/priority-field-mappings?q_workflowId=' + str(workflow_id)
    return self.__get_response(url, headers)

  def mapping_get_data_mapping_by_external_id(self, headers, external_id):
    url = self.base_url + '/mapping/data-mappings?q_externalId=' + str(external_id)
    return self.__get_response(url, headers)

  def mapping_get_data_mapping_by_workflow_id(self, headers, workflow_id):
    url = self.base_url + '/mapping/data-mappings?q_workflowId=' + str(workflow_id)
    return self.__get_response(url, headers)

  def mapping_get_workflow_by_id(self, headers, workflow_id):
    url = self.base_url + '/mapping/workflows/' + str(workflow_id)
    return self.__get_response(url, headers)

  def mapping_get_subworkflows_by_workflow_id(self, headers, workflow_id):
    url = self.base_url + '/mapping/subworkflows?q_workflowId=' + str(workflow_id)
    return self.__get_response(url, headers)

  def mapping_get_extractable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_jobType=extraction'
    return self.__get_response(url, headers)

  def mapping_get_transformable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_jobType=transform'
    return self.__get_response(url, headers)

  def mapping_get_loadable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_jobType=load'
    return self.__get_response(url, headers)

  def integration_get_integrations(self, headers):
    url = self.base_url + '/integration/integrations'
    return self.__get_response(url, headers)

  def integration_smart_file_info_list_files(self, headers, smart_file_id):
    url = self.base_url + '/integration/smartfiles/' + str(smart_file_id) + '/info/list_files'
    return self.__get_response(url, headers)

  def integration_smart_file_get_data(self, headers, smart_file_id, name):
    url = self.base_url + '/integration/smartfiles/' + str(smart_file_id) + '/data/' + str(name)
    return self.__get_response(url, headers)

  def integration_smart_file_get_by_id(self, headers, smart_file_id):
    url = self.base_url + '/integration/smartfiles/' + str(smart_file_id)
    return self.__get_response(url, headers)

  def integration_salesforce_get_by_id(self, headers, salesforce_id):
    url = self.base_url + '/integration/salesforces/' + str(salesforce_id)
    return self.__get_response(url, headers)

  def integration_salesforce_sf_get_table_fields(self, headers, salesforce_id, table_name):
    url = self.base_url + '/integration/salesforces/' + str(salesforce_id) + '/jsforce/' + str(table_name) + '/getTableFields'
    return self.__get_response(url, headers)

  def integration_webhook_get_by_id(self, headers, webhook_id):
    url = self.base_url + '/integration/webhook/' + str(webhook_id)
    return self.__get_response(url, headers)

  def external_webhook_get_data(self, headers, external_id):
    url = self.base_url + '/external/wb-etls?q_externalId=' + str(external_id)
    return self.__get_response(url, headers)
