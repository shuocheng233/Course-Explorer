import os
from sqlalchemy import create_engine
from sqlalchemy.engine import url
from dotenv import load_dotenv

load_dotenv()

class Config:
    MYSQL_USER = os.getenv('MYSQL_USER')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    MYSQL_DB = os.getenv('MYSQL_DB')
    MYSQL_HOST = os.getenv('MYSQL_HOST')
    MYSQL_CONNECTION = os.getenv('MYSQL_CONNECTION')

class Development(Config):
    @staticmethod
    def get_engine():
        user = Config.MYSQL_USER
        password = Config.MYSQL_PASSWORD
        db = Config.MYSQL_DB
        host = Config.MYSQL_HOST
    
        return create_engine(
            f"mysql+pymysql://{user}:{password}@{host}/{db}"
        )
    
class Production(Config):
    @staticmethod
    def get_engine():
        user = Config.MYSQL_USER
        password = Config.MYSQL_PASSWORD
        db = Config.MYSQL_DB
        connection = Config.MYSQL_CONNECTION

        return create_engine(
            url.URL.create(
                drivername="mysql+pymysql",
                username=user,
                password=password,
                database=db,
                query={
                    'unix_socket': f'/cloudsql/{connection}'
                }
            )
        )