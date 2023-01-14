import os
from dotenv import load_dotenv

load_dotenv()

# define env
class Env:
    def name(self):
      return "Midas"

    def logger_alerting(self):
      return os.getenv("LOGGER_ALERTING")

    def logger_slack(self):
      return os.getenv("LOGGER_SLACK")

    def slack_webhook(self):
      return os.getenv("SLACK_WEBHOOK")

    def backend_api_base_url(self):
      return os.getenv("API_URL")

    def postgres_host(self):
      return os.getenv("POSTGRES_HOST")

    def postgres_database(self):
      return os.getenv("POSTGRES_DATABASE")

    def postgres_username(self):
      return os.getenv("POSTGRES_USERNAME")

    def postgres_password(self):
      return os.getenv("POSTGRES_PASSWORD")

    def access_allow_control_origin(self):
      return os.getenv("CORS_ACCESS_ALLOW_CONTROL_ORIGIN")

    def rabbitmq_host()
      return os.getenv("RABBIT_MQ_HOST")

    def rabbitmq_username()
      return os.getenv("RABBIT_MQ_USERNAME")

    def rabbitmq_password()
      return os.getenv("RABBIT_MQ_PASSWORD")

    def rabbitmq_pattern()
      return os.getenv("RABBIT_MQ_PATTERN")
