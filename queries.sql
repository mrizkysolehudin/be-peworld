-- Active: 1692428075479@@localhost@5432@db_peworld


CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  role INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  photo VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  confirmPassword VARCHAR(255),
  region VARCHAR(255),
  job_title VARCHAR(255),
  company VARCHAR(255),
  company_field VARCHAR(255),
  description TEXT
);

CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    company_field VARCHAR(255),
    company_place VARCHAR(255),
    company_description TEXT,
    company_email VARCHAR(255),
    company_instagram VARCHAR(255),
    company_phone VARCHAR(15),
    company_linkedin VARCHAR(255),
    user_id INT
);

CREATE TABLE skill (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(255),
    user_id INT
);

CREATE TABLE work_experience (
    we_id SERIAL PRIMARY KEY,
    position VARCHAR(255),
    company_name VARCHAR(255),
    we_date VARCHAR(255),
    we_description TEXT,
    user_id INT
);

CREATE TABLE portfolio (
    portfolio_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255) CHECK (type IN ('mobile', 'web')),
    image VARCHAR(255),
    link VARCHAR(255),
    user_id INT
);

CREATE TABLE hire (
    hire_id SERIAL PRIMARY KEY,
    objective VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(15),
    description TEXT,
    recruiter_id INT,
    worker_id INT
);



SELECT * FROM users;

SELECT * FROM users WHERE ROLE=0 AND user_id=1;


INSERT INTO users (
        role,
				name,
				email,
				phone,
				photo,
				password,
				confirmPassword,
				region,
				job_title,
				company,
				company_field,
				description
    ) VALUES (
        1,
        '${name}',
        '${email}',
        '${phone}',
        '${photo}',
        '${password}',
        '${confirmPassword}',
        '${region}',
        '${job_title}',
        '${company}',
        '${company_field}',
        '${description}'
    )

SELECT enumlabel FROM pg_enum
WHERE enumtypid = 'portfolio_type'::regtype;


SELECT COUNT(*) FROM users WHERE ROLE=1;

	SELECT * FROM users 
	WHERE ROLE=1 AND users.name ILIKE '%b%'
	ORDER BY users.name ASC
	LIMIT 10
	OFFSET 0; 



-- portfolio
INSERT INTO portfolio (name, type, image, link, user_id) 
	VALUES  ('${name}','mobile', '${image}', '${link}', 20);

SELECT DISTINCT type FROM portfolio;

