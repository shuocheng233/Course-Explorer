# imports
from flask import Flask, request, make_response
import os
import sqlalchemy
from sqlalchemy import text
from yaml import load, Loader
from flask_cors import CORS



def init_connection_engine():
    """ initialize database setup
    Takes in os variables from environment if on GCP
    Reads in local variables that will be ignored in public repository.
    Returns:
        pool -- a connection to GCP MySQL
    """


    # detect env local or gcp
    if os.environ.get('GAE_ENV') != 'standard':
        try:
            variables = load(open("app.yaml"), Loader=Loader)
        except OSError as e:
            print("Make sure you have the app.yaml file setup")
            os.exit()

        env_variables = variables['env_variables']
        for var in env_variables:
            os.environ[var] = env_variables[var]

    pool = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL.create(
            drivername="mysql+pymysql",
            username=os.environ.get('MYSQL_USER'),
            password=os.environ.get('MYSQL_PASSWORD'),
            database=os.environ.get('MYSQL_DB'),
            host=os.environ.get('MYSQL_HOST')
        )
    )
    return pool


app = Flask(__name__)
CORS(app)
db = init_connection_engine()

@app.route("/")
def homepage():
    """ returns rendered homepage """
    conn = db.connect()
    query = "SELECT * FROM (SELECT r.Subject, COUNT(*) AS NumberOfCourses, AVG(r.Rating) AS AverageRating, COUNT(*) AS NumberOfFavorite FROM Rating r JOIN Favorite f ON r.Subject = f.Subject GROUP BY r.Subject) a ORDER BY Subject LIMIT 15;"
    query_results = conn.execute(text(query)).fetchall()
    conn.close()
    # print(query_results)
    ret = []
    for result in query_results:
        item = {
            "subject": result[0],
            "courses": result[1],
            "average": result[2],
            "favorite": result[3]
        }
        ret.append(item)
    print(ret)
    return ret
