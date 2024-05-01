-- Stored Procedure to give a rank to sections by amount of favorites and average ratings

DELIMITER //

CREATE PROCEDURE RankSection()

BEGIN

    SELECT * 
    FROM 
        (SELECT CRN, CourseTitle, Subject, COUNT(*) AS NumberOfFavorite, COUNT(*), AVG(Rating) AS AverageRating
        FROM Section
        NATURAL JOIN Favorite
        NATURAL JOIN User 
        NATURAL JOIN Rating
        GROUP BY PrimaryInstructor, Number, Subject) a
    ORDER BY NumberOfFavorite DESC, AverageRating DESC;

END //

DELIMITER;


-- 


-- SELECT * FROM (
-- SELECT r.PrimaryInstructor, r.Subject, r.Number, r.Rating, r.Comments, s.CRN, g.GPA
-- FROM Rating r
-- NATURAL JOIN GPAByInstructor g
-- NATURAL JOIN Section s 
-- WHERE g.GPA >= (SELECT AVG(GPA) FROM GPAByInstructor)
-- ) a
-- ORDER BY a.GPA
