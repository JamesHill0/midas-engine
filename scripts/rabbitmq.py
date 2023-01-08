import pika
import sys

import json

from env import Env

class RabbitMQ:
    def __init__(self):
        e = Env()
        self.host = e.rabbitmq_host()
        self.username = e.rabbitmq_username()
        self.password = e.rabbitmq_password()
        self.pattern = e.rabbitmq_pattern()

    def __connect(self):
        credentials = pika.PlainCredentials(self.username, self.password)
        parameters = pika.ConnectionParameters(self.host, 5672, '/', credentials)
        conn = pika.BlockingConnection(parameters)

        return conn

    def publish(self, queue, pattern, data):
        try:
            pattern = self.pattern + '.' + pattern
            conn = self.__connect()
            channel = conn.channel()
            channel.queue_declare(queue=queue, durable=True)
            channel.basic_publish(exchange='', routing_key=queue, body=json.dumps({
                'pattern': pattern,
                'data': data
            }))
            conn.close()

            return
        except Exception as e:
            self.logger.exception(self.log_name, 'error occured when publishing a message: ' + str(e))
            return
