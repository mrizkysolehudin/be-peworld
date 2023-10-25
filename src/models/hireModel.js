const db = require("../configs/db");

const selectAllHire = (search, sort, limit, offset) => {
	return db.query(` 
	SELECT hire.*, worker.name AS worker_name, recruiter.name AS recruiter_name
	FROM hire
	JOIN users AS worker ON hire.worker_id = worker.user_id
	JOIN users AS recruiter ON hire.recruiter_id = recruiter.user_id
	WHERE hire.name ILIKE '%${search}%' 
	ORDER BY hire.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset};
	`);
};

const selectHire = (hire_id) => {
	return db.query(`SELECT * FROM hire WHERE hire_id=${hire_id}`);
};

const updateHire = (data) => {
	const {
		hire_id,
		title,
		description,
		image,
		video,
		category_id,
		ingredients,
		user_id,
	} = data;

	const query = `
	UPDATE hire
	SET
		title = $1,
		description = $2,
		image = $3,
		category_id = $4,
		ingredients = $5,
		video = $6,
		user_id = $7,
		created_at = CURRENT_TIMESTAMP
	WHERE
		hire_id = $8
`;
	const values = [
		title,
		description,
		image,
		category_id,
		ingredients,
		video,
		user_id,
		hire_id,
	];

	return db.query(query, values);
};

// penerapan fitur fe
const selectHiresUserByWorkerId = (worker_id) => {
	return db.query(`
	SELECT
	hire.*,
	worker.name AS worker_name, recruiter.name AS recruiter_name
FROM
	hire
JOIN
	users AS worker ON hire.worker_id = worker.user_id
JOIN 
	users AS recruiter ON hire.recruiter_id = recruiter.user_id
WHERE
	worker.user_id = ${worker_id} 
	`);
};

const insertHire = (data) => {
	const { objective, name, email, phone, description, recruiter_id, worker_id } =
		data;

	return db.query(`INSERT INTO hire (objective, name, email, phone, description, recruiter_id, worker_id) 
	VALUES  ('${objective}', '${name}', '${email}', '${phone}', '${description}', ${recruiter_id}, ${worker_id})`);
};

const deleteHire = (hire_id) => {
	return db.query(`DELETE FROM hire WHERE hire_id=${hire_id}`);
};

const countDataHire = () => {
	return db.query("SELECT COUNT(*) FROM hire");
};

module.exports = {
	selectAllHire,
	insertHire,
	selectHire,
	updateHire,
	deleteHire,
	countDataHire,
	selectHiresUserByWorkerId,
};
