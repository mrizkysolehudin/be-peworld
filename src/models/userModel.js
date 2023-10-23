const db = require("../configs/db.js");

const selectAllusers = (search, sort, limit, offset) => {
	return db.query(`
	SELECT * FROM users 
	WHERE users.name ILIKE '%${search}%'
	ORDER BY users.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectUser = (user_id) => {
	return db.query(`SELECT * FROM users WHERE user_id=${user_id}`);
};

const updateUser = (data) => {
	const {
		user_id,
		role,
		name,
		email,
		phone,
		photo,
		region,
		job_title,
		company,
		company_field,
		instagram,
		linkedin,
		description,
	} = data;

	return db.query(
		`UPDATE users
			SET
					role = ${role},		
			  	name = '${name}',
					email = '${email}',
					phone = '${phone}',
					photo = '${photo}',
					region = '${region}',
					job_title = '${job_title}',
					company = '${company}',
					company_field = '${company_field}',
					instagram = '${instagram}',
					linkedin = '${linkedin}',
					description = '${description}'
			WHERE
				  user_id=${user_id}`,
	);
};

// recruiter
const selectRecruiter = (user_id) => {
	return db.query(`SELECT * FROM users WHERE ROLE=0 AND user_id=${user_id}`);
};

const insertRecruiter = (data) => {
	const {
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
		instagram,
		linkedin,
		description,
	} = data;

	return db.query(
		`INSERT INTO users (
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
				instagram,
				linkedin,
				description
    ) VALUES (
        ${0},
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
        '${instagram}',
        '${linkedin}',
        '${description}'
    )`,
	);
};

const updateRecruiter = (data) => {
	const {
		user_id,
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
		instagram,
		linkedin,
		description,
	} = data;

	return db.query(
		`UPDATE users
			SET
					role = ${0},		
			  	name = '${name}',
					email = '${email}',
					phone = '${phone}',
					photo = '${photo}',
					password = '${password}',
					confirmPassword = '${confirmPassword}',
					region = '${region}',
					job_title = '${job_title}',
					company = '${company}',
					company_field = '${company_field}',
					instagram = '${instagram}',
					linkedin = '${linkedin}',
					description = '${description}'
			WHERE
				  user_id=${user_id}`,
	);
};

// worker
const selectAllWorkers = (search, sort, limit, offset) => {
	return db.query(`
	SELECT * FROM users 
	WHERE ROLE=1 AND users.name ILIKE '%${search}%'
	ORDER BY users.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset}; 
	`);
};

const selectWorker = (user_id) => {
	return db.query(`SELECT * FROM users WHERE ROLE=1 AND user_id=${user_id}`);
};

const insertWorker = (data) => {
	const {
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
		instagram,
		linkedin,
		description,
	} = data;

	return db.query(
		`INSERT INTO users (
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
				instagram,
				linkedin,
				description
    ) VALUES (
        ${1},
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
				'${instagram}',
				'${linkedin}',
        '${description}'
    )`,
	);
};

const updateWorker = (data) => {
	const {
		user_id,
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
		instagram,
		linkedin,
		description,
	} = data;

	return db.query(
		`UPDATE users
			SET
					name = '${name}',
					email = '${email}',
					phone = '${phone}',
					photo = '${photo}',
					password = '${password}',
					confirmPassword = '${confirmPassword}',
					region = '${region}',
					job_title = '${job_title}',
					company = '${company}',
					company_field = '${company_field}',
					instagram = '${instagram}',
					linkedin = '${linkedin}',
					description = '${description}'
			WHERE
					ROLE=1 AND user_id=${user_id}`,
	);
};

const deleteUser = (user_id) => {
	return db.query(`DELETE FROM users WHERE user_id=${user_id}`);
};

const findEmail = (email) => {
	return db.query(`SELECT * FROM users WHERE email='${email}'`);
};

const countDataUsers = () => {
	return db.query("SELECT COUNT(*) FROM users");
};

const countDataWorkers = () => {
	return db.query("SELECT COUNT(*) FROM users WHERE ROLE=1");
};

module.exports = {
	selectAllusers,
	selectUser,
	updateUser,
	deleteUser,
	findEmail,
	countDataUsers,
	selectRecruiter,
	insertRecruiter,
	updateRecruiter,
	selectAllWorkers,
	selectWorker,
	insertWorker,
	updateWorker,
	countDataWorkers,
};
