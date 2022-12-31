import psycopg2
from env import Env

class PG:
  def __init__(self):
    e = Env()
    self.host = e.pg_host()
    self.database = e.pg_database()
    self.username = e.pg_username()
    self.password = e.pg_password()

  def __connect(self):
    conn = psycopg2.connect(
      host = self.host,
      database = self.database,
      user = self.username,
      password = self.password
    )

    return conn

  def get_all(self, table):
    conn = self.__connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM midas." + table)
    records = cur.fetchall()
    cur.close()
    conn.close()

    return records
