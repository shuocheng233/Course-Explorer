# imports
from flask import Flask, request, make_response
import os
import sqlalchemy
from sqlalchemy import text
from yaml import load, Loader
from flask_cors import CORS

netID = ""

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
    conn = db.connect()
    query = "SELECT * FROM (SELECT r.Subject, COUNT(*) AS NumberOfCourses, AVG(r.Rating) AS AverageRating, COUNT(*) AS NumberOfFavorite FROM Rating r JOIN Favorite f ON r.Subject = f.Subject GROUP BY r.Subject) a ORDER BY Subject;"
    query_results = conn.execute(text(query)).fetchall()
    conn.close()
    print(query_results)
    ret = [{'subject':'subject','courses':'courses','average':'average','favorite':'favorite'}]
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

@app.route("/login", methods=["POST"])
def login():
    global netID
    data = request.json
    pre_netID = data['netID']
    password = data['password']
    
    conn = db.connect()
    query = 'select * from User where netID = "{}" and password = "{}";'.format(netID, password)
    try:
        query_results = conn.execute(text(query)).fetchall()
    except:
        conn.close()
        return 'QUERY FAILED', 400
    if query_results is None:
        conn.close()
        return 'USER DOES NOT EXIST', 400
    else:
        netID = pre_netID
        conn.close()
        return 'OK' ,200 
        # can also decide to return first, lastname



@app.route("/signup", methods = ["POST"])
def signup():
    data = request.json
    print(data)
    netID = data['netID']
    password = data['password']
    firstName = data['firstName']
    lastName = data['lastName']
    try:
        conn = db.connect()
        query = f"INSERT INTO User VALUES ('{netID}', '{password}', '{firstName}', '{lastName}');"
        conn.execute(text(query))
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/showFavorite")
def showFavorite():
    global netID
    if netID == '':
        return "Not Logged In", 400
    
    try:
        conn = db.connect()
        query = f"SELECT * FROM Favorite WHERE NetID = {netID};"
        result = conn.execute(text(query)).fetchall()
        conn.close()
        return result, 200
    except:
        conn.close()
        return "Could not query database", 400
    
    
@app.route("/addFavorite", methods = ["POST"])
def addFavorite():
    global netID
    if netID == "":
        return "Not Logged In", 400
    data = request.json
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"INSERT INTO Favorite VALUES ('{netID}', '{primaryInstructor}', '{subject}', '{number}');"
        conn.execute(text(query))
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400