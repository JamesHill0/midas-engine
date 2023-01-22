from blitz import Blitz
from extract_from_smartfile_mapper import ExtractFromSmartFileMapper
from rabbitmq import RabbitMQ

from env import Env
import requests
from logger import Logger

class ExtractFromSmartFile:
  def __init__(self):
    self.log_name = 'extract'

    self.blitz = Blitz()
    self.env = Env()
    self.mapper = ExtractFromSmartFileMapper(True)
    self.mq = RabbitMQ()

    self.logger = Logger('qa')

  def __check_if_account_mapping_is_existing(self, headers, name):
    account_mapping = self.blitz.mapping_get_account_mapping_by_name(headers, name)
    return account_mapping

  def create_account_mapping(self, api_key, subworkflow):
    headers = { 'x-api_key': api_key }
    self.logger.info(api_key, self.log_name, 'retrieving smart file lists')
    files = self.blitz.integration_smart_file_info_list_files(headers, subworkflow['integrationId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved smart file lists')

    self.logger.info(api_key, self.log_name, 'retrieving smart file integration')
    current_integration = self.blitz.integration_smart_file_get_by_id(headers, subworkflow['integrationId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved smart file integration : ' + current_integration['externalId'])

    if not files:
      self.logger.info(api_key, self.log_name, 'no file found skipping')
      return

    files = files[0]

    for f in files:
      filename = f['name']

      if f['isfile'] != True and f['mime'] != 'text/html':
        continue

      self.logger.info(api_key, self.log_name, 'downloading smart file : ' + f['name'])
      authentication_result = self.blitz.authentication_decrypt(current_integration['secret']['key'])
      smart_file_url = self.env.smart_file_url() + '/path/data/' + current_integration['secret']['directory'] + '/' + f['name']
      smart_file_headers = { 'Authorization': 'Basic ' + authentication_result['encoded'] }
      smart_file_result = requests.get(smart_file_url, headers=smart_file_headers)
      self.logger.info(api_key, self.log_name, 'successfully downloaded smart file : ' + f['name'])

      if smart_file_result == '':
        self.logger.info(api_key, self.log_name, 'skipping smart file processing as response is empty : ' + f['name'])
        continue

      json_data = self.mapper.to_json(f['name'], smart_file_result)

      mappings = []

      self.logger.info(api_key, self.log_name, 'creating account mappings for file : ' + f['name'])
      for key in json_data.keys():
        if key == '' or not key or key == 'PDFList':
          self.logger.info(api_key, self.log_name, 'skipping creating mapping : ' + key)
          continue

        if json_data[key] == '' or not json_data[key]:
          self.logger.info(api_key, self.log_name, 'skipping creating mapping : ' + key)
          continue

        if isinstance(json_data[key], (dict, list)):
          self.logger.info(api_key, self.log_name, 'skipping creating mapping : ' + key)
          continue

        mappings.append({
          'editable': False,
          'fromField': key,
          'toField': '',
          'fromData': str(json_data[key]),
          'toData': ''
        })

      name = current_integration['externalId'] + '-' + filename
      if len(mappings) > 0:
        self.logger.info(api_key, self.log_name, 'checking if there are existing account mapping : ' + f['name'])
        account_mapping = self.__check_if_account_mapping_is_existing(headers, name)

        if len(account_mapping) == 0:
          existing_account_mapping = account_mapping[0]
          if existing_account_mapping['currentJob'] == 'extract':

            data = {}
            for mapping in existing_account_mapping['mappings']:
              data.append({ 'id': mapping['id'] })

            self.mq.publish('blitz-api-mapping', 'mappings.deleted', {
              'apiKey': api_key,
              'data': data
            })

            self.logger.info(api_key, self.log_name, 'sending account mapping for update : ' + f['name'])
            self.mq.publish('blitz-api-mapping', 'accounts.mappings.updated', {
              'apiKey': api_key,
              'id': existing_account_mapping['id'],
              'data': {
                'currentJob': 'pre-transformation',
                'mappings': mappings
              }
            })
        else:
          self.logger.info(api_key, self.log_name, 'sending account mapping for creation : ' + f['name'])
          self.mq.publish('blitz-api-mapping', 'accounts.mappings.created', {
            'apiKey': api_key,
            'data': {
              'name': name,
              'currentJob': 'pre-transformation',
              'protected': False,
              'workflowId': subworkflow['workflowId'],
              'externalId': current_integration['externalId'],
              'mappings': mappings
            }
          })

  def create_field_mapping(self, api_key, subworkflow):
    return
