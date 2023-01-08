from env import Env

import requests
import json

class Blitz:
  def __init__(self, logger):
    e = Env()

    self.base_url = e.backend_api_base_url()

  def __get_response(self, url, headers):
    response = requests.get(url, headers=headers)
    if 'data' in response.json():
      return response.json()['data']

  def get_accounts(self):
    url = self.base_url + '/account/accounts'
    return self.__get_response(url, {})

  def get_account_mapping(self, headers, name):
    url = self.base_url + '/mapping/accounts?q_name=' + name
    return self.__get_response(url, headers)

  def get_extractable_from_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_job_type=extraction_from'
    return self.__get_response(url, headers)

  def get_extractable_to_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_job_type=extraction_to'
    return self.__get_response(url, headers)

  def get_transformable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_job_type=transform'
    return self.__get_response(url, headers)

  def get_loadable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_job_type=load'
    return self.__get_response(url, headers)

  def smart_file_info_list_files(self, headers, id):
    url = self.base_url + '/integration/smartfiles/' + id + '/info/list_files'
    return self.__get_response(url, headers)

  def smart_file_get_data(self, headers, id, name):
    url = self.base_url + '/integration/smartfiles/' + id + '/data/' + name
    return self.__get_response(url, headers)

  def webhook_get_integration(self, headers, id):
    url = self.base_url + '/integration/webhook/' + id
    return self.__get_response(url, headers)

  def webhook_get_data(self, headers, external_id):
    url = self.base_url + '/external/wb-etls?q_external_id=' + external_id
    return self.__get_response(url, headers)
