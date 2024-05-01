CREATE PROCEDURE Ranking AS

BEGIN

SELECT * FROM 
(SELECT CRN, CourseTitle, Subject, COUNT(*) AS NumberOfFavorite, COUNT(*), AVG(Rating) AS AverageRating
FROM Section
NATURAL JOIN Favorite
NATURAL JOIN User 
NATURAL JOIN Rating
GROUP BY PrimaryInstructor, Number, Subject) a
ORDER BY NumberOfFavorite DESC, AverageRating DESC;

END