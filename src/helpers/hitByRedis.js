const client = require("../configs/redis");

const hitById = async (req, res, next) => {
	const userId = req.params.id;

	try {
		const user = await client.get(`getFromRedis/${userId}`);

		if (user) {
			let result = JSON.parse(user);
			res.send({
				fromCache: true,
				data: result.rows[0],
			});
		} else {
			next();
		}
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = hitById;
