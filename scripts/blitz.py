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

  def get_workflows(self):
    url = self.base_url + '/mapping/workflows'
    response = requests.get(url)
    if 'data' in response.json():
      return response.json()['data']
