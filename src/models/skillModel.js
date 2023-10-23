const db = require("../configs/db");

const selectAllSkills = (search, sort, limit, offset) => {
	return db.query(` 
	SELECT skill.*, users.name AS username 
	FROM skill
	JOIN users ON skill.user_id = users.user_id
	WHERE skill.name ILIKE '%${search}%' 
	ORDER BY skill.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset};
	`);
};

const selectSkill = (skill_id) => {
	return db.query(`SELECT * FROM skill WHERE skill_id=${skill_id}`);
};

const updateSkill = (data) => {
	const {
		skill_id,
		title,
		description,
		image,
		video,
		category_id,
		ingredients,
		user_id,
	} = data;

	const query = `
	UPDATE skill
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
		skill_id = $8
`;
	const values = [
		title,
		description,
		image,
		category_id,
		ingredients,
		video,
		user_id,
		skill_id,
	];

	return db.query(query, values);
};

// penerapan fitur fe
const selectSkillsUserByUserId = (user_id) => {
	return db.query(`
	SELECT
	skill.*,
	users.name AS username
FROM
	skill
JOIN
	users ON skill.user_id = users.user_id
WHERE
	users.user_id = ${user_id} 
	`);
};

const insertSkill = (data) => {
	const { name, user_id } = data;

	return db.query(`INSERT INTO skill (name, user_id) 
	VALUES  ('${name}', ${user_id})`);
};

const deleteSkill = (skill_id) => {
	return db.query(`DELETE FROM skill WHERE skill_id=${skill_id}`);
};

const countDataSkill = () => {
	return db.query("SELECT COUNT(*) FROM skill");
};

module.exports = {
	selectAllSkills,
	insertSkill,
	selectSkill,
	updateSkill,
	deleteSkill,
	countDataSkill,
	selectSkillsUserByUserId,
};
