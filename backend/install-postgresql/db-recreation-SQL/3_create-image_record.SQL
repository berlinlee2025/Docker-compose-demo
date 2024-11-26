CREATE TABLE image_record (
	id serial PRIMARY KEY,
	user_id integer NOT NULL, 
	image_url TEXT NOT NULL, 
	image_blob TEXT,
	metadata TEXT,
	--base64_backend TEXT,
	date_time timestamp with time zone NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);
