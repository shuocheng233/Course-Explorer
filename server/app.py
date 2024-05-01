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
    query = f"select * from User where NetID = '{pre_netID}' and Password = '{password}';"
    try:
        query_results = conn.execute(text(query)).fetchall()
    except:
        conn.close()
        return 'QUERY FAILED', 400
    if len(query_results) == 0:
        conn.close()
        return 'USER DOES NOT EXIST', 401
    else:
        netID = pre_netID
        conn.close()
        return {
            "firstName": query_results[0].FirstName,
            "lastName": query_results[0].LastName
        }, 200 
        # can also decide to return first, lastname



@app.route("/signup", methods = ["POST"])
def signup():
    global netID
    data = request.json
    print(data)
    netID = data['netID']
    password = data['password']
    firstName = data['firstName']
    lastName = data['lastName']
    try:
        conn = db.connect()
        query = f"INSERT INTO User VALUES ('{netID}', '{password}', '{firstName}', '{lastName}');"
        res = conn.execute(text(query))
        # query = f"select * from User where NetID = '{netID}' and Password = '{password}';"
        # query_results = conn.execute(text(query)).fetchall()
        # print('results:')
        # for x in query_results:
        #     print(x)
        conn.commit()
        conn.close()
        return { "message": "OK"}, 200
    except:
        conn.close()
        return { "message": f"Account with NetID '{netID}' already exists"}, 401
    
@app.route("/logout")
def logout():
    global netId
    netId = ""
    return "", 200
    
@app.route("/showFavorite", methods = ["POST"])
def showFavorite():
    global netID
    data = request.json
    netID = data['netID']
    if netID == '':
        return "Not Logged In", 400
    
    try:
        conn = db.connect()
        query = f"SELECT * FROM Favorite WHERE NetID = '{netID}';"
        result = conn.execute(text(query)).fetchall()
        favorite_list = []
        for res in result:
            item = {
                "PrimaryInstructor": res[1],
                "Subject": res[2],
                "Number": res[3]
            }
            favorite_list.append(item)
        conn.close()
        
        return favorite_list, 200
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
    
@app.route("/deleteFavorite", methods = ["POST"])
def deleteFavorite():
    global netID
    if netID == "":
        return "Not Logged In", 400
    data = request.json
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"DELETE FROM Favorite where NetID = '{netID}' and PrimaryInstructor = '{primaryInstructor}' and Subject = '{subject}' and Number = '{number}');"
        conn.execute(text(query))
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/addRating", methods = ["POST"])
def addRating():
    global netID
    if netID == "":
        return "Not Logged In", 400
    data = request.json
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    rating = data['rating']
    comments = data['comments']
    try:
        conn = db.connect()
        query = f"INSERT INTO Rating VALUES ('{netID}', '{primaryInstructor}', '{subject}', '{number}', '{rating}', '{comments}');"
        conn.execute(text(query))
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/deleteRating", methods = ["POST"])
def deleteRating():
    global netID
    if netID == "":
        return "Not Logged In", 400
    data = request.json
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    # rating = data['rating']
    # comments = data['comments']
    try:
        conn = db.connect()
        query = f"DELETE FROM Rating where NetID = '{netID}' and PrimaryInstructor = '{primaryInstructor}' and Subject = '{subject}' and Number = '{number}');"
        conn.execute(text(query))
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/updateRating", methods = ["POST"])
def updateRating():
    global netID
    if netID == "":
        return "Not Logged In", 400
    data = request.json
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    new_rating = data['rating']
    new_comments = data['comments']
    try:
        conn = db.connect()
        query = f"Update Rating set Rating = '{new_rating}', Comments = '{new_comments}' where NetID = '{netID}' and PrimaryInstructor = '{primaryInstructor}' and Subject = '{subject}' and Number = '{number}');"
        conn.execute(text(query))
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/showRatings")
def showRatings():
    global netID
    if netID == '':
        return "Not Logged In", 400
    
    try:
        conn = db.connect()
        query = f"SELECT * FROM Rating WHERE NetID = '{netID}';"
        result = conn.execute(text(query)).fetchall()
        conn.close()
        return result, 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/getCourses", methods=['POST'])
def getCourses():
    data = request.json
    yearTerm = '2024-sp'
    if "yearTerm" in data:
        yearTerm = data['yearTerm']
    subject = data['subject']
    try:
        conn = db.connect()
        query = f"SELECT DISTINCT Subject, Number, CourseTitle FROM Section WHERE Subject = {subject} AND YearTerm = {yearTerm};"
        result = conn.execute(text(query)).fetchall()
        section_list = []
        for res in result:
            item = {
                "PrimaryInstructor": res[1],
                "Subject": res[2],
                "Number": res[3]
            }
            section_list.append(item)
        conn.close()
        return result, 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/getSections", methods=['POST'])
def getSections():
    data = request.json
    yearTerm = '2024-sp'
    if "yearTerm" in data:
        yearTerm = data['yearTerm']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"SELECT * FROM Section WHERE Subject = '{subject}' AND Number = '{number}' AND YearTerm = '{yearTerm}';"
        print(query)
        result = conn.execute(text(query)).fetchall()
        for res in result:
            print(res)
        conn.close()
        return result, 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/getCourseRatings", methods=['POST'])
def getCourseRatings():
    data = request.json
    subject = data['subject']
    number = data['number']
    primaryInstructor = data['primaryInstructor']
    try:
        conn = db.connect()
        GPA = f"SELECT FullName, GPA FROM GPAByInstructor WHERE Subject = '{subject}' AND Number = '{number}' AND PrimaryInstructor = '{primaryInstructor}';"
        Rating = f"SELECT NetID, Rating, Comments FROM Rating WHERE Subject = '{subject}' AND Number = '{number}' AND PrimaryInstructor = '{primaryInstructor}';"
        GPA = conn.execute(text(GPA)).fetchall()
        Rating = conn.execute(text(Rating)).fetchall()
        conn.close()
        result = {"GPA": GPA, "Ratings": Rating}
        return result, 200
    except:
        conn.close()
        return "Could not query database", 400