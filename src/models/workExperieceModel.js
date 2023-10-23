const db = require("../configs/db");

const selectAllWorkExperiences = (search, sort, limit, offset) => {
	return db.query(` 
	SELECT work_experience.*, users.name AS username 
	FROM work_experience
	JOIN users ON work_experience.user_id = users.user_id
	WHERE work_experience.company_name ILIKE '%${search}%' 
	ORDER BY work_experience.company_name ${sort}
	LIMIT ${limit}
	OFFSET ${offset};
	`);
};

const selectWorkExperience = (we_id) => {
	return db.query(`SELECT * FROM work_experience WHERE we_id=${we_id}`);
};

const updateWorkExperience = (data) => {
	const {
		we_id,
		title,
		description,
		image,
		video,
		category_id,
		ingredients,
		user_id,
	} = data;

	const query = `
	UPDATE work_experience
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
		we_id = $8
`;
	const values = [
		title,
		description,
		image,
		category_id,
		ingredients,
		video,
		user_id,
		we_id,
	];

	return db.query(query, values);
};

// penerapan fitur fe
const selectWorkExperiencesUserByUserId = (user_id) => {
	return db.query(`
	SELECT
	work_experience.*,
	users.name AS username
FROM
	work_experience
JOIN
	users ON work_experience.user_id = users.user_id
WHERE
	users.user_id = ${user_id} 
	`);
};

const insertWorkExperience = (data) => {
	const { position, company_name, we_date, we_description, user_id } = data;

	return db.query(`INSERT INTO work_experience (position, company_name, we_date, we_description, user_id) 
	VALUES  ('${position}','${company_name}', '${we_date}', '${we_description}', ${user_id})`);
};

const deleteWorkExperience = (we_id) => {
	return db.query(`DELETE FROM work_experience WHERE we_id=${we_id}`);
};

const countDataWorkExperience = () => {
	return db.query("SELECT COUNT(*) FROM work_experience");
};

module.exports = {
	selectAllWorkExperiences,
	insertWorkExperience,
	selectWorkExperience,
	updateWorkExperience,
	deleteWorkExperience,
	countDataWorkExperience,
	selectWorkExperiencesUserByUserId,
};
