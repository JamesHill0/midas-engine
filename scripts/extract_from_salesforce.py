from blitz import Blitz
from rabbitmq import RabbitMQ

class ExtractFromSalesforce:
  def __init__(self):
    self.blitz = Blitz()
    self.mq = RabbitMQ()

  def create_account_mapping(self, api_key, subworkflow):
    return

  def create_field_mapping(self, api_key, subworkflow):
