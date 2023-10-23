const cloudinary = require("../helpers/cloudinary.js");
const { response, responseError } = require("../helpers/response.js");
const workExperienceModel = require("../models/workExperieceModel.js");
const userModel = require("../models/userModel.js");

const workExperienceController = {
	getAllWorkExperiences: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await workExperienceModel.countDataWorkExperience();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		workExperienceModel
			.selectAllWorkExperiences(search, sort, limit, offset)
			.then((result) => {
				return response(
					res,
					result.rows,
					200,
					"get workExperiences success",
					pagination,
				);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getWorkExperience: async (req, res) => {
		const workExperience_id = req.params.id;

		workExperienceModel
			.selectWorkExperience(workExperience_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "WorkExperience id is not found");
				}

				return response(res, result.rows, 200, "get workExperience success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateWorkExperience: async (req, res) => {
		try {
			const workExperience_id = req.params.id;

			const { title, description, category_id, ingredients, video, user_id } =
				req.body;

			let imageUrl = "";
			if (req.files.image) {
				const uploadImageToCloudinary = await cloudinary.uploader.upload(
					req.files?.image?.[0].path,
					{
						folder: "mama_workExperience/workExperience",
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
						folder: "mama_workExperience/workExperience/video",
						resource_type: "video",
					},
				);
				if (!uploadVideoToCloudinary) {
					return responseError(res, 400, "upload video failed");
				}
				videoUrl = uploadVideoToCloudinary?.secure_url ?? "";
			}

			const { rowCount, rows } = await workExperienceModel.selectWorkExperience(
				workExperience_id,
			);
			if (!rowCount) {
				return responseError(res, 404, "WorkExperience id is not found");
			}

			const currentWorkExperience = rows[0];

			const data = {
				workExperience_id,
				title: title ?? currentWorkExperience?.title,
				description: description ?? currentWorkExperience?.description,
				image: imageUrl ?? currentWorkExperience?.image,
				category_id: category_id ?? currentWorkExperience?.category_id,
				video: videoUrl ?? video ?? currentWorkExperience?.video,
				ingredients: ingredients ?? currentWorkExperience?.ingredients,
				user_id,
			};

			await workExperienceModel.updateWorkExperience(data);

			return response(res, data, 200, "update workExperience success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// penerapan fitur fe
	getWorkExperiencesUserByUserId: async (req, res) => {
		try {
			const user_id = req.params.user_id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			workExperienceModel
				.selectWorkExperiencesUserByUserId(user_id)
				.then((result) => {
					return response(res, result.rows, 200, "get user workExperiences success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	createWorkExperience: async (req, res) => {
		try {
			const { position, company_name, we_date, we_description, user_id } =
				req.body;

			const data = {
				position: position ?? "",
				company_name: company_name ?? "",
				we_date: we_date ?? "",
				we_description: we_description ?? "",
				user_id: user_id ?? "",
			};

			await workExperienceModel.insertWorkExperience(data);

			return response(res, data, 201, "create workExperience success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deleteWorkExperience: async (req, res) => {
		try {
			const workExperience_id = req.params.id;

			const { rowCount } = await workExperienceModel.selectWorkExperience(
				workExperience_id,
			);
			if (!rowCount) {
				return responseError(res, 404, "WorkExperience id is not found");
			}

			workExperienceModel
				.deleteWorkExperience(workExperience_id)
				.then(() => {
					return response(res, null, 200, "delete workExperience success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},
};

module.exports = workExperienceController;
