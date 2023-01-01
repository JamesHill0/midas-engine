from env import Env

import requests
import json

class Blitz:
  def __init__(self, logger):
    e = Env()

    self.base_url = e.backend_api_base_url()

  def get_accounts(self):
    url = self.base_url + '/account/accounts'
    response = requests.get(url)
    if 'data' in response.json():
      return response.json()['data']

  def get_extractable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_job_type=extraction'
    response = requests.get(url, headers=headers)
    if 'data' in response.json():
      return response.json()['data']

  def get_transformable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_job_type=transform'
    response = requests.get(url, headers=headers)
    if 'data' in response.json():
      return response.json()['data']

  def get_loadable_subworkflows(self, headers):
    url = self.base_url + '/mapping/subworkflows?q_job_type=load'
    response = requests.get(url, headers=headers)
    if 'data' in response.json():
      return response.json()['data']
