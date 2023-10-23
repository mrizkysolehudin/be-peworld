const db = require("../configs/db");

const selectAllPortfolios = (search, sort, limit, offset) => {
	return db.query(` 
	SELECT portfolio.*, users.name AS username 
	FROM portfolio
	JOIN users ON portfolio.user_id = users.user_id
	WHERE portfolio.name ILIKE '%${search}%' 
	ORDER BY portfolio.name ${sort}
	LIMIT ${limit}
	OFFSET ${offset};
	`);
};

const selectPortfolio = (portfolio_id) => {
	return db.query(`SELECT * FROM portfolio WHERE portfolio_id=${portfolio_id}`);
};

const updatePortfolio = (data) => {
	const {
		portfolio_id,
		title,
		description,
		image,
		video,
		category_id,
		ingredients,
		user_id,
	} = data;

	const query = `
	UPDATE portfolio
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
		portfolio_id = $8
`;
	const values = [
		title,
		description,
		image,
		category_id,
		ingredients,
		video,
		user_id,
		portfolio_id,
	];

	return db.query(query, values);
};

// penerapan fitur fe
const selectPortfoliosUserByUserId = (user_id) => {
	return db.query(`
	SELECT
	portfolio.portfolio_id,
	portfolio.name,
	portfolio.type,
	portfolio.image,
	portfolio.link,
	users.name AS username
FROM
	portfolio
JOIN
	users ON portfolio.user_id = users.user_id
WHERE
	users.user_id = ${user_id} 
	`);
};

const insertPortfolio = (data) => {
	const { name, type, image, link, user_id } = data;

	return db.query(`INSERT INTO portfolio (name, type, image, link, user_id) 
	VALUES  ('${name}','${type}', '${image}', '${link}', ${user_id})`);
};

const deletePortfolio = (portfolio_id) => {
	return db.query(`DELETE FROM portfolio WHERE portfolio_id=${portfolio_id}`);
};

const countDataPortfolio = () => {
	return db.query("SELECT COUNT(*) FROM portfolio");
};

module.exports = {
	selectAllPortfolios,
	insertPortfolio,
	selectPortfolio,
	updatePortfolio,
	deletePortfolio,
	countDataPortfolio,
	selectPortfoliosUserByUserId,
};
