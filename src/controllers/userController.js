const userModel = require("../models/userModel.js");
const { response, responseError } = require("../helpers/response.js");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../helpers/jwt.js");
const cloudinary = require("../helpers/cloudinary.js");
// const redis = require("../configs/redis.js");

const userController = {
	getAllUsers: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await userModel.countDataUsers();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		userModel
			.selectAllusers(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get users success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getUser: async (req, res) => {
		const user_id = req.params.id;
		userModel
			.selectUser(user_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "User id is not found");
				}
				return response(res, result.rows, 200, "get user success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateUser: async (req, res) => {
		try {
			const user_id = req.params.id;
			const {
				role,
				name,
				email,
				phone,
				region,
				job_title,
				company,
				company_field,
				instagram,
				linkedin,
				description,
			} = req.body;

			let imageUrl = "";
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "peworld/users",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const { rowCount, rows } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			const currentUser = rows[0];

			const data = {
				user_id,
				role: role ?? currentUser?.role,
				name: name ?? currentUser?.name,
				email: email ?? currentUser?.email,
				phone: phone ?? currentUser?.phone,
				photo: imageUrl ?? currentUser?.photo,
				region: region ?? currentUser?.region,
				job_title: job_title ?? currentUser?.job_title,
				company: company ?? currentUser?.company,
				company_field: company_field ?? currentUser?.company_field,
				instagram: instagram ?? currentUser?.instagram,
				linkedin: linkedin ?? currentUser?.linkedin,
				description: description ?? currentUser?.description,
			};

			userModel
				.updateUser(data)
				.then(() => {
					return response(res, data, 200, "update user success");
				})
				.catch((error) => {
					return responseError(res, 500, error);
				});
		} catch (error) {
			return responseError(res, 500, error);
		}
	},

	deleteUser: async (req, res) => {
		try {
			const user_id = req.params.id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			userModel
				.deleteUser(user_id)
				.then(() => {
					return response(res, null, 200, "delete user success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	loginUser: async (req, res) => {
		const { email, password } = req.body;

		userModel
			.findEmail(email)
			.then((result) => {
				const [user] = result.rows;

				if (!user) {
					return responseError(res, 404, "Email not found");
				}

				const checkPassword = bcrypt.compareSync(password, user.password);
				if (!checkPassword) {
					return responseError(res, 400, "Incorrect password");
				}

				delete user.password;
				delete user.confirmpassword;

				const payload = {
					user,
				};
				user.token = generateToken(payload);
				const refreshToken = generateRefreshToken(payload);
				user.refreshToken = refreshToken;

				return response(res, user, 200, "login success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	// recruiter
	registerRecruiter: async (req, res) => {
		try {
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
			} = req.body;
			const passwordHash = bcrypt.hashSync(password);
			const confirmPasswordHash = bcrypt.hashSync(confirmPassword);

			const { rowCount } = await userModel.findEmail(email);
			if (rowCount) {
				return responseError(res, 400, "Email already taken.");
			}

			const data = {
				name: name ?? "",
				email: email ?? "",
				phone: phone ?? "",
				password: passwordHash,
				confirmPassword: confirmPasswordHash ?? "",
				photo:
					photo ??
					"https://res.cloudinary.com/dskltx6xi/image/upload/v1694509756/mama_recipe/users/blank_dd1daa.png",
				region: region ?? "",
				job_title: job_title ?? "",
				company: company ?? "",
				company_field: company_field ?? "",
				instagram: instagram ?? "",
				linkedin: linkedin ?? "",
				description: description ?? "",
			};

			await userModel.insertRecruiter(data);
			return response(res, data, 201, "create user success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// worker
	getAllWorkers: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await userModel.countDataWorkers();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		userModel
			.selectAllWorkers(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get workers success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	registerWorker: async (req, res) => {
		try {
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
			} = req.body;
			const passwordHash = bcrypt.hashSync(password);
			const confirmPasswordHash = bcrypt.hashSync(confirmPassword);

			const { rowCount } = await userModel.findEmail(email);
			if (rowCount) {
				return responseError(res, 400, "Email already taken.");
			}

			const data = {
				name: name ?? "",
				email: email ?? "",
				phone: phone ?? "",
				password: passwordHash,
				confirmPassword: confirmPasswordHash ?? "",
				photo:
					photo ??
					"https://res.cloudinary.com/dskltx6xi/image/upload/v1694509756/mama_recipe/users/blank_dd1daa.png",
				region: region ?? "",
				job_title: job_title ?? "",
				company: company ?? "",
				company_field: company_field ?? "",
				instagram: instagram ?? "",
				linkedin: linkedin ?? "",
				description: description ?? "",
			};

			await userModel.insertWorker(data);
			return response(res, data, 201, "create user success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// redis
	// getById: (req, res) => {
	// 	const id = req.params.id;

	// 	userModel
	// 		.selectUser(id)
	// 		.then((result) => {
	// 			const dataRedis = redis.set(`getFromRedis/${id}`, JSON.stringify(result), {
	// 				EX: 180,
	// 				NX: true,
	// 			});
	// 			res.send({
	// 				fromCache: false,
	// 				data: dataRedis,
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			res.json({ message: error.message });
	// 		});
	// },
};

module.exports = userController;
