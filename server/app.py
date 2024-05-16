# imports
from flask import Flask, request, send_from_directory
import os, sys
from sqlalchemy import create_engine, text
from yaml import load, Loader
from flask_cors import CORS

def init_connection_engine():
    """ initialize database setup
    Takes in os variables from environment if on GCP
    Reads in local variables that will be ignored in public repository.
    Returns:
        pool -- a connection to GCP MySQL
    """
    try:
        # Detect environment: local or GCP
        if os.environ.get('GAE_ENV', '').startswith('standard'):
            # Running on Google App Engine
            db_user = os.environ.get('MYSQL_USER')
            db_pass = os.environ.get('MYSQL_PASSWORD')
            db_name = os.environ.get('MYSQL_DB')
            cloud_sql_connection_name = os.environ.get('MYSQL_CONNECTION_NAME')
            return create_engine(
                f"mysql+pymysql://{db_user}:{db_pass}@/cloudsql/{cloud_sql_connection_name}/{db_name}",
                pool_pre_ping=True
            )

        else:
            # Running locally
            with open("app.yaml", 'r') as file:
                variables = load(file, Loader=Loader)
                env_variables = variables['env_variables']
                for var, value in env_variables.items():
                    os.environ[var] = value
                    
            return create_engine(
                f"mysql+pymysql://{os.environ['MYSQL_USER']}:{os.environ['MYSQL_PASSWORD']}@"
                f"{os.environ['MYSQL_HOST']}:{os.environ['MYSQL_PORT']}/{os.environ['MYSQL_DB']}",
                pool_pre_ping=True
            )

    except Exception as e:
        print(f"Error creating engine: {e}")
        sys.exit(1)

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)
db = init_connection_engine()

@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/', methods=['GET'])
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

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
    netID = data['netID']
    password = data['password']
    firstName = data['firstName']
    lastName = data['lastName']
    try:
        conn = db.connect()
        query = f"INSERT INTO User VALUES ('{netID}', '{password}', '{firstName}', '{lastName}');"
        res = conn.execute(text(query))
        conn.commit()
        conn.close()
        return { "message": "OK"}, 200
    except:
        conn.close()
        return { "message": f"Account with NetID '{netID}' already exists."}, 401
    
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
    data = request.json
    netID = data['netID']
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"select * from Favorite where NetID = '{netID}' and PrimaryInstructor = '{primaryInstructor}' and Subject = '{subject}' and Number = '{number}';"
        res = conn.execute(text(query)).fetchall()
        if len(res) == 0:
            query = f"INSERT INTO Favorite VALUES ('{netID}', '{primaryInstructor}', '{subject}', '{number}');"
        else:
            conn.close()
            return "OK", 200
        conn.execute(text(query))
        conn.commit()
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/deleteFavorite", methods = ["POST"])
def deleteFavorite():
    data = request.json
    netID = data['netID']
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"DELETE FROM Favorite where NetID = '{netID}' and PrimaryInstructor = '{primaryInstructor}' and Subject = '{subject}' and Number = '{number}';"
        conn.execute(text(query))
        conn.commit()
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/deleteRating", methods = ["POST"])
def deleteRating():
    data = request.json
    netID = data['netID']
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"DELETE FROM Rating where NetID = '{netID}' and PrimaryInstructor = '{primaryInstructor}' and Subject = '{subject}' and Number = '{number}';"
        conn.execute(text(query))
        conn.commit()
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/updateRating", methods = ["POST"])
def updateRating():
    data = request.json
    netID = data['netID']
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    new_rating = data['rating']
    new_comments = data['comments']
    try:
        
        conn = db.connect()
        # query = f"call update_or_insert_rating('{netID}', '{primaryInstructor}', '{subject}', '{number}', '{new_rating}', '{new_comments}');"
        # conn.execute(text(query))
        
        query = f"select * from Rating where NetID = '{netID}' and PrimaryInstructor = '{primaryInstructor}' and Subject = '{subject}' and Number = '{number}'"
        res = conn.execute(text(query)).fetchall()
        if len(res) != 0:
            query = text(
                "Update Rating set Rating = :new_rating, Comments = :new_comments "
                "where NetID = :netID and PrimaryInstructor = :primaryInstructor and "
                "Subject = :subject and Number = :number"
            )
            conn.execute(query, {
                'new_rating': new_rating, 
                'new_comments': new_comments, 
                'netID': netID, 
                'primaryInstructor': primaryInstructor, 
                'subject': subject, 
                'number': number
            })
        else:
            query = text(
                "INSERT INTO Rating (NetID, PrimaryInstructor, Subject, Number, Rating, Comments) "
                "VALUES (:netID, :primaryInstructor, :subject, :number, :new_rating, :new_comments)"
            )
            conn.execute(query, {
                'netID': netID,
                'primaryInstructor': primaryInstructor,
                'subject': subject,
                'number': number,
                'new_rating': new_rating,
                'new_comments': new_comments
            })
        
        conn.commit()
        conn.close()
        return "OK", 200
    except Exception as e:
        conn.close()
        print(e)
        return "Could not query database", 400
    
@app.route("/showRatings", methods=["POST"])
def show_ratings():
    data = request.json
    Subject = data['Subject']
    Number = data['Number']
    PrimaryInstructor = data['PrimaryInstructor']
    try:
        conn = db.connect()
        query = f"""
            SELECT r.NetID, r.PrimaryInstructor, r.Subject, r.Number, r.Rating, r.Comments,
                   u.FirstName, u.LastName
            FROM Rating r
            JOIN User u ON r.NetID = u.NetID
            WHERE r.Subject = '{Subject}'
              AND r.Number = '{Number}'
              AND r.PrimaryInstructor = '{PrimaryInstructor}';
        """
        result = conn.execute(text(query)).fetchall()
        rating_list = []
        for res in result:
            item = {
                "NetID": res[0],
                "PrimaryInstructor": res[1],
                "Subject": res[2],
                "Number": res[3],
                "Rating": res[4],
                "Comments": res[5],
                "firstName": res[6],
                "lastName": res[7]
            }
            rating_list.append(item)
        conn.close()
        return rating_list, 200
    except Exception as e:
        print(e)
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
                "Subject": res[0],
                "Number": res[1],
                "CourseTitle": res[2]
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
    year = 20
    if "year" in data:
        year = data['year']
    term = ""
    if "term" in data:
        term = data['term']
    subject = ""
    if "subject" in data:
        subject = data['subject']
    number = ""
    if "number" in data:
        number = f"{data['number']}"
    try:
        conn = db.connect()
        query = f"SELECT * FROM Section WHERE Subject LIKE '{subject}%' AND Number LIKE '{number}%' AND YearTerm LIKE '{year}%' AND YearTerm LIKE '%{term}' ORDER BY YearTerm DESC, Subject ASC, Number ASC LIMIT 500;"
        if term and year != 20:
            query = f"SELECT * FROM Section WHERE Subject LIKE '{subject}%' AND Number LIKE '{number}%' AND YearTerm = '{year}-{term}' ORDER BY YearTerm DESC, Subject ASC, Number ASC LIMIT 500;"
            print(query)
        result = conn.execute(text(query)).fetchall()
        section_list = []
        for res in result:
            year_item = res[1][0:4]
            term_item = res[1][5:]
            item = {
                "CRN": res[0],
                "Year": year_item,
                "Term": term_item,
                "YearTerm": res[1],
                "Subject": res[2],
                "Number": res[3],
                "CourseTitle": res[4],
                "Description": res[5],
                "CreditHours": res[6],
                "SectionInfo": res[7],
                "DegreeAttributes": res[8],
                "ScheduleInformation": res[9],
                "Section": res[10],
                "StatusCode": res[11],
                "PartofTerm": res[12],
                "SectionTitle": res[13],
                "SectionCreditHours": res[14],
                "EnrollmentStatus": res[15],
                "Type": res[16],
                "TypeCode": res[17],
                "StartTime": res[18],
                "EndTime": res[19],
                "DaysofWeek": res[20],
                "Room": res[21],
                "Building": res[22],
                "Instructors": res[23],
                "PrimaryInstructor": res[24]
            }
            section_list.append(item)
        conn.close()
        return section_list, 200
    except:
        conn.close()
        return "Could not query database", 400
      
@app.route("/getRankings", methods=['POST'])
def getRankings():
    data = request.json
    FilterBy = ""
    if "FilterBy" in data:
        FilterBy = data['FilterBy']
    try:
        conn = db.connect()
        query = f"CALL RankSection ('{FilterBy}')"
        result = conn.execute(text(query)).fetchall()
        # print(result)
        # conn.commit()
        conn.close()
        rankings_list = []
        for res in result:
            item = {
                "PrimaryInstructor": res[0],
                "Subject": res[1],
                "Number": res[2],
                "NumberOfFavorite": res[3],
                "AverageRating": res[4]
            }
            rankings_list.append(item)
        return rankings_list, 200
    except Exception as e:
        print(e)
        conn.close()
        return { "message": "Could not query database"}, 400
    
@app.route("/getGPA", methods=['POST'])
def getGPA():
    data = request.json
    PrimaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"SELECT GPA FROM GPAByInstructor WHERE Subject = '{subject}' AND Number = '{number}' AND PrimaryInstructor = '{PrimaryInstructor}';"
        result = conn.execute(text(query)).fetchall()
        conn.close()
        return {
                "GPA": result[0][0] if result else -1
        }, 200
    except Exception as e:
        print(e)
        print(result)
        conn.close()
        return "Could not query database", 400