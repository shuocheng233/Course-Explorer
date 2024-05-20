# imports
from flask import Flask, request, send_from_directory
import os, sys
import sqlalchemy
from sqlalchemy import create_engine, text
from config import Development, Production
from flask_cors import CORS, cross_origin

netID = ""

def init_connection_engine():
    try:
        # Detect environment: local or GCP
        if os.environ.get('GAE_ENV', '').startswith('standard'):
            # Running on Google App Engine
            return Production.get_engine()
        else:
            # Running locally
            return Development.get_engine()
    except Exception as e:
        sys.exit("Failed to initialize database engine.")

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/') # last two parameters only for local development
CORS(app)

db = init_connection_engine()

@app.route('/', methods=['GET'])
def serve_index():
    path_to_index = os.path.join(app.static_folder, 'index.html')
    try:
        if not os.path.exists(path_to_index):
            raise FileNotFoundError(f"No such file: {path_to_index}")
        
        response = send_from_directory(app.static_folder, 'index.html')
        return response
    except Exception as e:
        return str(e), 500

@app.route("/api/login", methods=["POST"])
@cross_origin()
def login():
    global netID
    data = request.json
    pre_netID = data['netID']
    password = data['password']
    conn = db.connect()
    query = f"select * from User where NetID = :pre_netID and Password = :password"
    try:
        query_results = conn.execute(text(query), { 'pre_netID': pre_netID, 'password': password }).fetchall()
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

@app.route("/api/signup", methods = ["POST"])
@cross_origin()
def signup():
    global netID
    data = request.json
    netID = data['netID']
    password = data['password']
    firstName = data['firstName']
    lastName = data['lastName']
    try:
        conn = db.connect()
        query = f"INSERT INTO User VALUES (:netID, :password, :firstName, :lastName);"
        res = conn.execute(text(query), { 'netID': netID, 'password': password, 'firstName': firstName, 'lastName': lastName })
        conn.commit()
        conn.close()
        return { "message": "OK" }, 200
    except:
        conn.close()
        return { "message": f"Account with NetID '{netID}' already exists."}, 401
    
@app.route("/api/logout")
def logout():
    global netId
    netId = ""
    return "", 200
    
@app.route("/api/showFavorite", methods = ["POST"])
def showFavorite():
    global netID
    data = request.json
    netID = data['netID']
    if netID == '':
        return "Not Logged In", 400
    
    try:
        conn = db.connect()
        query = f"SELECT * FROM Favorite WHERE NetID = :netID"
        result = conn.execute(text(query), { 'netID': netID }).fetchall()
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
    
    
@app.route("/api/addFavorite", methods = ["POST"])
def addFavorite():
    data = request.json
    netID = data['netID']
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"select * from Favorite where NetID = :netID and PrimaryInstructor = :primaryInstructor and Subject = :subject and Number = :number"
        res = conn.execute(text(query), { 'netID': netID, 'primaryInstructor': primaryInstructor, 'subject': subject, 'number': number }).fetchall()
        if len(res) == 0:
            query = f"INSERT INTO Favorite VALUES (:netID, :primaryInstructor, :subject, :number);"
        else:
            conn.close()
            return "OK", 200
        conn.execute(text(query), { 'netID': netID, 'primaryInstructor': primaryInstructor, 'subject': subject, 'number': number })
        conn.commit()
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/api/deleteFavorite", methods = ["POST"])
def deleteFavorite():
    data = request.json
    netID = data['netID']
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"DELETE FROM Favorite where NetID = :netID and PrimaryInstructor = :primaryInstructor and Subject = :subject and Number = :number"
        conn.execute(text(query), { 'netID': netID, 'primaryInstructor': primaryInstructor, 'subject': subject, 'number': number })
        conn.commit()
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/api/deleteRating", methods = ["POST"])
def deleteRating():
    data = request.json
    netID = data['netID']
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"DELETE FROM Rating where NetID = :netID and PrimaryInstructor = :primaryInstructor and Subject = :subject and Number = :number"
        conn.execute(text(query), { 'netID': netID, 'primaryInstructor': primaryInstructor, 'subject': subject, 'number': number })
        conn.commit()
        conn.close()
        return "OK", 200
    except:
        conn.close()
        return "Could not query database", 400
    
@app.route("/api/updateRating", methods = ["POST"])
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
        query = f"select * from Rating where NetID = :netID and PrimaryInstructor = :primaryInstructor and Subject = :subject and Number = :number"
        res = conn.execute(text(query), { 'netID': netID, 'primaryInstructor': primaryInstructor, 'subject': subject, 'number': number }).fetchall()
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
    
@app.route("/api/showRatings", methods=["POST"])
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
            WHERE r.Subject = :Subject
              AND r.Number = :Number
              AND r.PrimaryInstructor = :PrimaryInstructor
        """
        result = conn.execute(text(query), { 'PrimaryInstructor': PrimaryInstructor, 'Subject': Subject, 'Number': Number }).fetchall()
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
    
@app.route("/api/getSections", methods=['POST'])
def getSections():
    data = request.json
    try:
        year = data.get('year', 0)
        term = data.get('term', "")
        subject = data.get('subject', "")
        number = data.get('number', 0)

        conn = db.connect()
        conditions = []

        if subject:
            conditions.append(f"Subject = :subject")
        if number:
            conditions.append(f"Number = :number")

        if year and term:
            conditions.append(f"YearTerm = '{year}-{term}'")
            query = f"SELECT * FROM Section WHERE {' AND '.join(conditions)} ORDER BY YearTerm DESC, Subject ASC, Number ASC LIMIT 500;"
        elif year:
            query = (
                f"SELECT * FROM Section WHERE {' AND '.join(conditions)} AND YearTerm = '{year}-fa' "
                f"UNION ALL "
                f"SELECT * FROM Section WHERE {' AND '.join(conditions)} AND YearTerm = '{year}-sp' "
                f"ORDER BY YearTerm DESC, Subject ASC, Number ASC LIMIT 500;"
            )
        elif term:
            query = (
                " UNION ALL ".join(
                    f"SELECT * FROM Section WHERE {' AND '.join(conditions)} AND YearTerm = '{y}-{term}'"
                    for y in range(2016, 2025)
                ) +
                " ORDER BY YearTerm DESC, Subject ASC, Number ASC LIMIT 500;"
            )
        else:
            query = f"SELECT * FROM Section WHERE {' AND '.join(conditions)} ORDER BY YearTerm DESC, Subject ASC, Number ASC LIMIT 500;"
        
        result = conn.execute(text(query), { 'subject': subject, 'number': number }).fetchall()
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
      
@app.route("/api/getRankings", methods=['POST'])
def getRankings():
    data = request.json
    FilterBy = ""
    if "FilterBy" in data:
        FilterBy = data['FilterBy']
    try:
        conn = db.connect()
        query = f"CALL RankSection (:FilterBy)"
        result = conn.execute(text(query), { 'FilterBy': FilterBy }).fetchall()
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
    
@app.route("/api/getGPA", methods=['POST'])
def getGPA():
    data = request.json
    primaryInstructor = data['primaryInstructor']
    subject = data['subject']
    number = data['number']
    try:
        conn = db.connect()
        query = f"SELECT GPA FROM GPAByInstructor WHERE Subject = :subject AND Number = :number AND PrimaryInstructor = :primaryInstructor"
        result = conn.execute(text(query), { 'primaryInstructor': primaryInstructor, 'subject': subject, 'number': number }).fetchall()
        conn.close()
        return {
                "GPA": result[0][0] if result else -1
        }, 200
    except Exception as e:
        print(e)
        print(result)
        conn.close()
        return "Could not query database", 400