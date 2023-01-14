import logging

from slack import Slacker
from env import Env
from rabbitmq import RabbitMQ

# logger with slack connectivity
class Logger:
    def __init__(self):
      self.mq = RabbitMQ()

    # info
    def info(self, api_key, name, message):
        self.__send("INFO", name, message)
        logging.info(message)

        if api_key:
          self.mq.publish('blitz-api-mapping', 'logger.info', {
            'apiKey': api_key,
            'data': {
              'name': name,
              'message': message
            }
          })

    # error
    def error(self, api_key, name, message):
        self.__send("ERROR", name, message)
        logging.error(message)

        if api_key:
          self.mq.publish('blitz-api-mapping', 'logger.error', {
            'apiKey': api_key,
            'data': {
              'name': name,
              'message': message
            }
          })


    # exception for breaking errors
    def exception(self, api_key, name, message):
        self.__send("EXCEPTION", name, message)
        logging.exception(message)

        if api_key:
          self.mq.publish('blitz-api-mapping', 'logger.exception', {
            'apiKey': api_key,
            'data': {
              'name': name,
              'message': message
            }
          })


    # send
    def __send(self, typ, name, message):
        e = Env()

        if e.logger_alerting() != "True":
            return

        if e.logger_slack() == "True":
            sl = Slacker(e.slack_webhook())
            sl.send("[%s] [%s] %s - %s : %s" % (typ, e.name(), name, e.mode(), message))
