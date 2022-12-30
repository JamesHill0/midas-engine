from slack_webhook import Slack
from time import sleep

class Slacker:
    def __init__(self, url):
        self.sl = Slack(url=url)
    
    def send(self, message):
        try:
            self.sl.post(text=message)
        except Exception as err:
            print("Slacker: Trying again in 5 seconds: %s" % (err))
            sleep(5)
            self.send(message)
