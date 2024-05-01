-- Stored Procedure to give a rank to sections by amount of favorites and average ratings

DELIMITER //

CREATE PROCEDURE RankSection(IN FilterBy VARCHAR(50))

BEGIN
    IF FilterBy = "GPA" THEN 
        CREATE TABLE temp AS (
            SELECT r.PrimaryInstructor, r.Subject, r.Number
            FROM Rating r
            NATURAL JOIN GPAByInstructor g
            WHERE g.GPA >= (SELECT AVG(GPA) FROM GPAByInstructor)
        );
    ELSEIF FilterBy = "RATING" THEN 
        CREATE TABLE temp AS (
            SELECT r.PrimaryInstructor, r.Subject, r.Number
            FROM Rating r
            NATURAL JOIN GPAByInstructor g
            WHERE r.Rating >= (SELECT AVG(Rating) FROM Rating)
        );
    ELSE
        CREATE TABLE temp AS (
            SELECT r.PrimaryInstructor, r.Subject, r.Number
            FROM Rating r
            NATURAL JOIN GPAByInstructor g
        );
    END IF;
        
    SELECT * 
    FROM 
        (SELECT PrimaryInstructor, Subject, Number, COUNT(Favorite.NetID) AS NumberOfFavorite, AVG(Rating) AS AverageRating
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

BEGIN TRANSACTION;

-- update the orders table
UPDATE orders 
SET status = 'shipped' 
WHERE order_id = 123;

--update the inventory table
UPDATE inventory 
SET quantity = quantity - 1 
WHERE product_id = 456;

COMMIT TRANSACTION;




----------- Trigger -----------

CREATE TRIGGER trig 
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

CREATE TRIGGER trig 
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


CREATE TRIGGER trig 
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
