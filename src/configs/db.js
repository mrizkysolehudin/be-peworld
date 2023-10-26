const { Pool } = require("pg");
require("dotenv").config();

// const db = new Pool({
// 	host: process.env.DB_HOST,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_NAME,
// 	port: process.env.DB_PORT,
// 	connectionString: process.env.PG_URL + "?sslmode=require",
// });
// const db = new Pool({
// 	host: process.env.PG_HOST,
// 	user: process.env.PG_USER,
// 	password: process.env.PG_PASSWORD,
// 	database: process.env.PG_DATABASE,
// 	port: process.env.PG_PRISMA_URL,
// 	connectionString: process.env.PG_URL + "?sslmode=require",
// });
const db = new Pool({
	connectionString: process.env.PG_URL + "?sslmode=require",
});

module.exports = db;
