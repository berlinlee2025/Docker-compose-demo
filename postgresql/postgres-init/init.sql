-- 1. users table
CREATE TABLE users (
	ID SERIAL PRIMARY KEY, 
	name VARCHAR(100) NOT NULL, 
	email TEXT NOT NULL,
	entries bigint,
	joined timestamp without time zone NOT NULL
);

-- 2. login table
CREATE TABLE login (
	id SERIAL PRIMARY KEY,
	hash VARCHAR(100) NOT NULL,
	email TEXT UNIQUE NOT NULL
);

-- 3. table `image_record`
CREATE TABLE image_record (
	id SERIAL PRIMARY KEY,
	user_id integer NOT NULL, 
	image_url VARCHAR(255) NOT NULL,
    image_blob TEXT,
    metadata TEXT, 
    --base64_backend TEXT,
	date_time timestamp with time zone NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4.
CREATE OR REPLACE FUNCTION enforce_row_limit_on_image_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Set max. row to 100 only
    IF (SELECT COUNT(*) FROM image_record) > 1000 THEN
        -- Delete entries that exceed the 1000-row limit
        DELETE FROM image_record
        WHERE id IN(
            SELECT id FROM image_record
            ORDER BY date_time DESC
            LIMIT (SELECT COUNT(*) - 1000 FROM image_record)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5.
CREATE TRIGGER trigger_check_row_limit_on_image_record
AFTER INSERT ON image_record
FOR EACH ROW EXECUTE PROCEDURE enforce_row_limit_on_image_record();

-- 6. table `image_details`
CREATE TABLE image_details (
	ID serial PRIMARY KEY,
	image_id INT NOT NULL, --Assuming `image_record`.`id` INT
	raw_hex VARCHAR(7) NOT NULL, --hex #ffffff
	--value INT NOT NULL, --hex #ffffff
	hex_value VARCHAR(20) NOT NULL,
	w3c_hex VARCHAR(7) NOT NULL,
	w3c_name VARCHAR(50) NOT NULL,
	FOREIGN KEY (image_id) REFERENCES image_record(id)
);

-- 7.
CREATE OR REPLACE FUNCTION enforce_row_limit_on_image_details()
RETURNS TRIGGER AS $$
BEGIN
    -- Set max. row to 5000 only
    IF (SELECT COUNT(*) FROM image_details) > 5000 THEN
        -- Delete entries that exceed the 20-row limit
        DELETE FROM image_details
        WHERE id IN(
            SELECT id FROM image_details
            ORDER BY image_id ASC
            LIMIT (SELECT COUNT(*) - 5000 FROM image_details)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8.
CREATE TRIGGER trigger_check_row_limit_on_image_details
AFTER INSERT ON image_details
FOR EACH ROW EXECUTE PROCEDURE enforce_row_limit_on_image_details();

-- 10. table `celebrity_record`
CREATE TABLE celebrity_record (
	id serial PRIMARY KEY,
	user_id integer NOT NULL, 
    celebrity_name VARCHAR(100) NOT NULL,
	image_url VARCHAR(255) NOT NULL,
	image_blob TEXT,
    metadata TEXT, 
    --base64_backend TEXT,
	date_time timestamp with time zone NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 11. 
CREATE OR REPLACE FUNCTION enforce_row_limit_on_celebrity_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Set max. row to 100 only
    IF (SELECT COUNT(*) FROM celebrity_record) > 1000 THEN
        -- Delete entries that exceed the 1000-row limit
        DELETE FROM celebrity_record
        WHERE id IN(
            SELECT id FROM celebrity_record
            ORDER BY date_time DESC
            LIMIT (SELECT COUNT(*) - 1000 FROM celebrity_record)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12.
CREATE TRIGGER trigger_check_row_limit_on_celebrity_record
AFTER INSERT ON celebrity_record
FOR EACH ROW EXECUTE PROCEDURE enforce_row_limit_on_celebrity_record();

-- 13. table `age_record`
CREATE TABLE age_record (
	id serial PRIMARY KEY,
	user_id integer NOT NULL, 
    age VARCHAR(20) NOT NULL,
	image_url VARCHAR(255) NOT NULL,
	image_blob TEXT,
    metadata TEXT, 
    --base64_backend TEXT,
	date_time timestamp with time zone NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 14.
CREATE OR REPLACE FUNCTION enforce_row_limit_on_age_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Set max. row to 100 only
    IF (SELECT COUNT(*) FROM age_record) > 1000 THEN
        -- Delete entries that exceed the 1000-row limit
        DELETE FROM age_record
        WHERE id IN(
            SELECT id FROM age_record
            ORDER BY date_time DESC
            LIMIT (SELECT COUNT(*) - 1000 FROM age_record)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15.
CREATE TRIGGER trigger_check_row_limit_on_age_record
AFTER INSERT ON age_record
FOR EACH ROW EXECUTE PROCEDURE enforce_row_limit_on_age_record();
