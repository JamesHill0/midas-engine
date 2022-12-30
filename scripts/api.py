import json

from flask import Flask, Blueprint, request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS

from logger import Logger
from env import Env
from postgres import PG
from salesforce import SF
from schema import Schema
from enums import SYNC_LOG_STATUS

log_name = "midas-api"

# init class objects
e = Env()
logger = Logger()

api_bp = Blueprint("api_v1", __name__)
api = Api(api_bp)

application = Flask(__name__)
application.register_blueprint(api_bp)
cors = CORS(application)
application.config["Access-Control-Allow-Origin"] = e.access_allow_control_origin()
application.config["Access-Control-Allow-Headers"] = "Content-Type,x-api-key"
application.config["Access-Control-Allow-Methods"] = "GET,POST,PATCH,UPDATE"

class Status(Resource):
    def get(self):
        try:
            logger.info(log_name, "successful ping")
            return { "message": "UP" }, 200
        except Exception as err:
            logger.error(log_name, "error occured on ping : %s " % (err))
            return { "error": "Invalid Server Error" }, 500

class Runner(Resource):
    # """
    # header: x-api-key
    # method: POST
    # {
    #   job: "extract/transform/load"
    # }
    # """
    def post(self):
      try:
        return "", 200
      except Exception as err:
        logger.error(log_name, "error occured on /runner post : %s " % (err))
        return "", 500

api.add_resource(Status, "/")
api.add_resource(Runner, "/runner")
