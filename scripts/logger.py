import logging

from slack import Slacker
from env import Env

# logger with slack connectivity
class Logger:
    # info
    def info(self, name, message):
        self.__send("INFO", name, message)
        logging.info(message)

    # error
    def error(self, name, message):
        self.__send("ERROR", name, message)
        logging.error(message)
    
    # exception for breaking errors
    def exception(self, name, message):
        self.__send("EXCEPTION", name, message)
        logging.exception(message)

    # send
    def __send(self, typ, name, message):
        e = Env()

        if e.logger_alerting() != "True":
            return
        
        if e.logger_slack() == "True":
            sl = Slacker(e.slack_webhook())
            sl.send("[%s] [%s] %s - %s : %s" % (typ, e.name(), name, e.mode(), message))
