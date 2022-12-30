import os
from dotenv import load_dotenv

load_dotenv()

# define env
class Env:
    def __init__(self):
        self.app = self.app_name().upper()

    def name(self):
        return os.getenv("NAME")

    def mode(self):
        return os.getenv("MODE")

    def app_name(self):
        return os.getenv("APP_NAME")

    def logger_alerting(self):
        return os.getenv("LOGGER_ALERTING")

    def logger_slack(self):
        return os.getenv("LOGGER_SLACK")

    def slack_webhook(self):
        return os.getenv("SLACK_WEBHOOK")

    def postgres_host(self):
        return os.getenv("%s_POSTGRES_HOST" % (self.app))

    def postgres_database(self):
        return os.getenv("%s_POSTGRES_DATABASE" % (self.app))

    def postgres_username(self):
        return os.getenv("%s_POSTGRES_USERNAME" % (self.app))

    def postgres_password(self):
        return os.getenv("%s_POSTGRES_PASSWORD" % (self.app))

    def access_allow_control_origin(self):
        return os.getenv("CORS_ACCESS_ALLOW_CONTROL_ORIGIN")
