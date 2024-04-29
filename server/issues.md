In app.py

Line 68 - 75: netID is not assigned a value before using (which actually makes the query "...where netID = "" and ...")

Line 118: mssing single/double quotes around {netID}

Also, for all the responses, the frontend is expecting an json object (i guess frontend can't parse a raw string? At least I don't know how to), which can be achieved by the following, maybe we can try that?

```python 
return jsonify({

                'firstName': some-value-here,

                'lastName': some-value-here

            }), 200
```

To access the /favorites oage,

first log in

and then click on username on the right top corner

click on my favorites courses