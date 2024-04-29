In app.py

For /getSections, the frontend will return an object
```javascript
{ year, term, number, subject }
```
Consider  the suer may input only some fields, the object may also contain fewer than expected attributes, like only ```{ year, subject }```. I don't know if you're good with
```Python
{ year: 2023, subject: 'CS' }
```
or
```Python
{ year: 2023, subject: 'CS', number: null, term: null }
```
Let me know!


For showFavorite endpoint: 
method should be POST with ```{ netID }```
missing single/double quotes around {netID} in the query

Also, for all the responses, the frontend is expecting an object. For errors, you may use
```python
{ message: 'user does not exist' }
```

To access the /favorites page,

first log in

and then click on username on the top right corner

click on my favorite courses