-- Stored Procedure to give a rank to sections by amount of favorites and average ratings

DELIMITER //

CREATE PROCEDURE RankSection(IN FilterBy VARCHAR(50))

BEGIN
    IF FilterBy = "GPA" THEN 
        CREATE TABLE IF NOT EXISTS temp AS (
            SELECT PrimaryInstructor, Subject, Number
            FROM GPAByInstructor
            WHERE GPA >= (SELECT AVG(GPA) FROM GPAByInstructor)
        );
    ELSEIF FilterBy = "RATING" THEN 
        CREATE TABLE IF NOT EXISTS temp AS (
            SELECT DISTINCT r.PrimaryInstructor, r.Subject, r.Number
            FROM Rating r
            NATURAL JOIN GPAByInstructor g
            WHERE r.Rating >= (SELECT AVG(Rating) FROM Rating)
        );
    ELSE
        CREATE TABLE IF NOT EXISTS temp AS (
            SELECT PrimaryInstructor, Subject, Number
            FROM GPAByInstructor
        );
    END IF;
        
    SELECT * 
    FROM 
        (SELECT DISTINCT PrimaryInstructor, Subject, Number, COUNT(Favorite.NetID) AS NumberOfFavorite, AVG(Rating) AS AverageRating
        FROM Favorite
        NATURAL JOIN User 
        NATURAL JOIN Rating
        GROUP BY PrimaryInstructor, Number, Subject) a
    NATURAL JOIN temp
    ORDER BY NumberOfFavorite DESC, AverageRating DESC
    LIMIT 200;

    DROP TABLE temp;

END //

DELIMITER ;


---------- Transaction ----------

DELIMITER //

CREATE PROCEDURE update_or_insert_rating(
    IN netID VARCHAR(50),
    IN primaryInstructor VARCHAR(50),
    IN subject VARCHAR(20),
    IN number INT,
    IN new_rating INT,
    IN new_comments VARCHAR(1000)
)
BEGIN
    DECLARE res_count INT;
    
    SELECT COUNT(*) INTO res_count
    FROM Rating
    WHERE NetID = netID
    AND PrimaryInstructor = primaryInstructor
    AND Subject = subject
    AND Number = number;
    
    START TRANSACTION;
    
    IF res_count > 0 THEN
        UPDATE Rating
        SET Rating = new_rating, Comments = new_comments
        WHERE NetID = netID
        AND PrimaryInstructor = primaryInstructor
        AND Subject = subject
        AND Number = number;
    ELSE
        INSERT INTO Rating (NetID, PrimaryInstructor, Subject, Number, Rating, Comments)
        VALUES (netID, primaryInstructor, subject, number, new_rating, new_comments);
    END IF;
    
    COMMIT;
END //

DELIMITER ;




----------- Trigger -----------

CREATE TRIGGER RatingTrigger 
BEFORE INSERT ON Rating
FOR EACH ROW
    BEGIN
        IF NEW.NetID = OLD.NetID AND NEW.Subject = OLD.Subject AND NEW.Number = OLD.Number AND NEW.PrimaryInstructor = OLD.PrimaryInstructor 
        THEN RETURN;
    END;
-- INSERT INTO Rating VALUES (NEW.NetID, NEW.PrimaryInstructor, NEW.Number, NEW.Subject, NEW.Rating, NEW.Comment);


-- CREATE TRIGGER trig 
-- BEFORE INSERT ON Rating
-- FOR EACH ROW
--     BEGIN
--         IF NEW.NetID = OLD.NetID AND NEW.Subject = OLD.Subject AND NEW.Number = OLD.Number AND NEW.PrimaryInstructor = OLD.PrimaryInstructor 
--         THEN ROLLBACK TRANSACTION;
--     END;

CREATE TRIGGER RatingTrigger 
BEFORE INSERT ON Rating
FOR EACH ROW
    BEGIN
        DECLARE user_rating_count INT;
        
        SELECT COUNT(*) INTO user_rating_count
        FROM Rating
        WHERE NetID = NEW.NetID
        AND Subject = NEW.Subject
        AND Number = NEW.Number
        AND PrimaryInstructor = NEW.PrimaryInstructor;
 
        IF user_rating_count > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User has already rated this class';
        END IF;
    END;


CREATE TRIGGER RatingTrigger 
BEFORE INSERT ON Rating
FOR EACH ROW
    BEGIN
        
        IF EXIST 
        (SELECT * FROM Rating
        WHERE NetID = NEW.NetID
        AND Subject = NEW.Subject
        AND Number = NEW.Number
        AND PrimaryInstructor = NEW.PrimaryInstructor) 
        THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User has already rated this class';
 
        END IF;
    END;



CREATE TRIGGER RatingTrigger 
AFTER INSERT ON Rating
FOR EACH ROW
    BEGIN
        
        IF EXIST 
        (SELECT * FROM Rating
        WHERE NetID = NEW.NetID
        AND Subject = NEW.Subject
        AND Number = NEW.Number
        AND PrimaryInstructor = NEW.PrimaryInstructor) 
        THEN ROLLBACK;
 
        END IF;
    END;