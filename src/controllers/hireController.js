const cloudinary = require("../helpers/cloudinary.js");
const { response, responseError } = require("../helpers/response.js");
const hireModel = require("../models/hireModel.js");
const userModel = require("../models/userModel.js");

const hireController = {
	getAllHire: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await hireModel.countDataHire();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		hireModel
			.selectAllHire(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get hires success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getHire: async (req, res) => {
		const hire_id = req.params.id;

		hireModel
			.selectHire(hire_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Hire id is not found");
				}

				return response(res, result.rows, 200, "get hire success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateHire: async (req, res) => {
		try {
			const hire_id = req.params.id;

			const { title, description, category_id, ingredients, video, user_id } =
				req.body;

			let imageUrl = "";
			if (req.files.image) {
				const uploadImageToCloudinary = await cloudinary.uploader.upload(
					req.files?.image?.[0].path,
					{
						folder: "peworld/hire",
						resource_type: "image",
					},
				);
				if (!uploadImageToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadImageToCloudinary?.secure_url ?? "";
			}

			let videoUrl = "";
			if (req.files.video) {
				const uploadVideoToCloudinary = await cloudinary.uploader.upload(
					req.files?.video?.[0].path,
					{
						folder: "peworld/hire/video",
						resource_type: "video",
					},
				);
				if (!uploadVideoToCloudinary) {
					return responseError(res, 400, "upload video failed");
				}
				videoUrl = uploadVideoToCloudinary?.secure_url ?? "";
			}

			const { rowCount, rows } = await hireModel.selectHire(hire_id);
			if (!rowCount) {
				return responseError(res, 404, "Hire id is not found");
			}

			const currentHire = rows[0];

			const data = {
				hire_id,
				title: title ?? currentHire?.title,
				description: description ?? currentHire?.description,
				image: imageUrl ?? currentHire?.image,
				category_id: category_id ?? currentHire?.category_id,
				video: videoUrl ?? video ?? currentHire?.video,
				ingredients: ingredients ?? currentHire?.ingredients,
				user_id,
			};

			await hireModel.updateHire(data);

			return response(res, data, 200, "update hire success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// penerapan fitur fe
	getHiresByWorkerId: async (req, res) => {
		try {
			const user_id = req.params.user_id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			hireModel
				.selectHiresUserByWorkerId(user_id)
				.then((result) => {
					return response(res, result.rows, 200, "get user hires success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	createHire: async (req, res) => {
		try {
			const {
				objective,
				name,
				email,
				phone,
				description,
				recruiter_id,
				worker_id,
			} = req.body;

			let imageUrl = "";
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "peworld/hire",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const data = {
				objective: objective ?? "",
				name: name ?? "",
				email: email ?? "",
				phone: phone ?? "",
				description: description ?? "",
				recruiter_id: recruiter_id ?? null,
				worker_id: worker_id ?? null,
			};

			await hireModel.insertHire(data);

			return response(res, data, 201, "create hire success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deleteHire: async (req, res) => {
		try {
			const hire_id = req.params.id;

			const { rowCount } = await hireModel.selectHire(hire_id);
			if (!rowCount) {
				return responseError(res, 404, "Hire id is not found");
			}

			hireModel
				.deleteHire(hire_id)
				.then(() => {
					return response(res, null, 200, "delete hire success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},
};

module.exports = hireController;
