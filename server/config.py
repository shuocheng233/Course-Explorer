import os
from sqlalchemy import create_engine
from sqlalchemy.engine import url

if os.getenv('ENVIRONMENT') == 'development':
    from dotenv import load_dotenv
    load_dotenv()
else:
    from google.cloud import secretmanager

class Development:
    @staticmethod
    def get_engine():
        user = os.getenv('MYSQL_USER')
        password = os.getenv('MYSQL_PASSWORD')
        db = os.getenv('MYSQL_DB')
        host = os.getenv('MYSQL_HOST')
    
        return create_engine(
            f"mysql+pymysql://{user}:{password}@{host}/{db}"
        )

class Production:
    @staticmethod
    def access_secret_version(secret_id):
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/cs411-cs411114/secrets/{secret_id}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode('UTF-8')

    @staticmethod
    def get_engine():
        user = Production.access_secret_version('db-user')
        password = Production.access_secret_version('db-password')
        db = Production.access_secret_version('db-name')
        connection = Production.access_secret_version('db-connection')

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