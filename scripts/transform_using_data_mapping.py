from blitz import Blitz
import datetime
import pandas as pd

class TransformUsingDataMapping:
  def __init__(self):
    self.blitz = Blitz()

  def __format_map(from_data, data_mapping):
    format_type = data_mapping['formatType']

    if format_type == 'date':
      date_result = datetime.datetime.strptime(from_data, data_mapping['formatting'])
      return date_result.date()
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
    current_integration = self.blitz.integration_salesforce_get_by_id(headers, subworkflow['integrationId'])

    data_mappings = self.blitz.mapping_get_data_mapping_by_external_id(headers, current_integration['externalId'])
    accounts_mappings = self.blitz.mapping_get_account_mapping_by_external_id(headers, current_integration['externalId'])

    dm = {}
    for data_mapping in data_mappings:
      dm[data_mapping['toField']] = data_mapping

    if not dm:
      return

    for account_mapping in account_mappings:
      if account_mapping['currentJob'] != 'transformation':
        continue

      for mapping in account_mapping['mappings']:
        if dm[mapping['fromField']]:
          data_mapping = dm[mapping['fromField']]
          formatted_data = self.__format_map(mapping['fromData'], data_mapping)

          if formatted_data:
            self.mq.publish('blitz-api-mapping', 'mappings.updated', {
              'apiKey': api_key,
              'id': mapping['id'],
              'data': {
                'toData': formatted_data
              }
            })

      self.mq.publish('blitz-api-mapping', 'accounts.mapping.updated', {
        'apiKey': api_key,
        'id': account_mapping['id'],
        'data': {
          'currentJob': 'load'
        }
      })
