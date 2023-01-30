from blitz import Blitz
import pandas as pd
from logger import Logger

from dateutil.parser import parse
from datetime import datetime, timezone

class TransformUsingDataMapping:
  def __init__(self):
    self.log_name = 'transform'
    self.blitz = Blitz()

    self.logger = Logger('qa')

  def __format_map(from_data, data_mapping):
    format_type = data_mapping['formatType']

    if format_type == 'date':
      parsed_date = parse(from_data)
      formatted_date = parsed_date.strftime(data_mapping['formatting'])
      return formatted_date
    elif format_type == 'number':
      ctr = 0
      result_string = ""
      for element in data_mapping['formatting']:
        if element == "#":
          result_string += from_data[ctr]
        else:
          result_string += element

        ctr += 1
      return result_string
    elif format_type == 'ssn':
      return f'{from_data[:3]}-{from_data[3:5]}-{from_data[5:]}'
    elif format_type == 'to_upper':
      return from_data.to_upper()
    elif format_type == 'to_lower':
      return from_data.to_lower()
    elif format_type == 'capitalize':
      return from_data.capitalize()
    elif format_type == 'conversion':
      for option in data_mapping['options']:
        if from_data == option['fromData']:
          return option['toData']
    else:
      return from_data

    return from_data

  def run(self, api_key, subworkflow):
    headers = { 'x-api-key': api_key }
    self.logger.info(api_key, self.log_name, 'retrieving integrations')
    integrations = self.blitz.integration_get_integrations(headers)
    self.logger.info(api_key, self.log_name, 'successfully retrieved integrations')

    current_integration = {}
    for integration in integrations:
      if str(integration['id']) == subworkflow['integrationId'] and integration['name'].lower() == subworkflow['integrationType'].lower():
        current_integration = integration
        break

    self.logger.info(api_key, self.log_name, 'retrieving existing data mappings')
    data_mappings = self.blitz.mapping_get_data_mapping_by_workflow_id(headers, subworkflow['workflowId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved existing data mappings')

    self.logger.info(api_key, self.log_name, 'retrieving account mappings : ' + current_integration['externalId'])
    account_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, current_integration['externalId'])
    self.logger.info(api_key, self.log_name, 'successfully retrieved account mappings : ' + current_integration['externalId'])

    dm = {}
    for data_mapping in data_mappings:
      dm[data_mapping['toField']] = data_mapping

    if not dm:
      self.logger.info(api_key, self.log_name, 'failed to find existing data mappings')
      return

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'transform':
        continue

      for mapping in account_mapping['mappings']:
        if mapping['toField'] in dm:
          data_mapping = dm[mapping['toField']]

          formatted_data = ''
          try:
            self.logger.info(api_key, self.log_name, 'executing data mapping according to settings : ' + mapping['fromData'])
            formatted_data = self.__format_map(mapping['fromData'], data_mapping)
          except:
            self.logger.info(api_key, self.log_name, 'data mapping unsuccessful skipping : ' + mapping['fromData'])
            continue

          if formatted_data:
            self.logger.info(api_key, self.log_name, 'sending data mapping for update : ' + mapping['fromData'] + ' -> ' + formatted_data)
            self.mq.publish('blitz-api-mapping', 'mappings.updated', {
              'apiKey': api_key,
              'id': mapping['id'],
              'data': {
                'toData': formatted_data
              }
            })

      self.mq.publish('blitz-api-mapping', 'accounts.mappings.updated', {
        'apiKey': api_key,
        'id': account_mapping['id'],
        'data': {
          'currentJob': 'load'
        }
      })
