import os

from api import application

if __name__ == "__main__":
  ENVIRONMENT_DEBUG = os.environ.get("APP_DEBUG", True)
  ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
  application.run(host='0.0.0.0', port=ENVIRONMENT_PORT, debug=ENVIRONMENT_DEBUG)