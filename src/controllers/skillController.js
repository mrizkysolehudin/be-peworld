const cloudinary = require("../helpers/cloudinary.js");
const { response, responseError } = require("../helpers/response.js");
const skillModel = require("../models/skillModel.js");
const userModel = require("../models/userModel.js");

const skillController = {
	getAllSkills: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 999999;
		let offset = (page - 1) * limit;

		const resultCount = await skillModel.countDataSkill();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		skillModel
			.selectAllSkills(search, sort, limit, offset)
			.then((result) => {
				return response(res, result.rows, 200, "get skills success", pagination);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getSkill: async (req, res) => {
		const skill_id = req.params.id;

		skillModel
			.selectSkill(skill_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Skill id is not found");
				}

				return response(res, result.rows, 200, "get skill success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updateSkill: async (req, res) => {
		try {
			const skill_id = req.params.id;

			const { title, description, category_id, ingredients, video, user_id } =
				req.body;

			let imageUrl = "";
			if (req.files.image) {
				const uploadImageToCloudinary = await cloudinary.uploader.upload(
					req.files?.image?.[0].path,
					{
						folder: "mama_skill/skill",
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
						folder: "mama_skill/skill/video",
						resource_type: "video",
					},
				);
				if (!uploadVideoToCloudinary) {
					return responseError(res, 400, "upload video failed");
				}
				videoUrl = uploadVideoToCloudinary?.secure_url ?? "";
			}

			const { rowCount, rows } = await skillModel.selectSkill(skill_id);
			if (!rowCount) {
				return responseError(res, 404, "Skill id is not found");
			}

			const currentSkill = rows[0];

			const data = {
				skill_id,
				title: title ?? currentSkill?.title,
				description: description ?? currentSkill?.description,
				image: imageUrl ?? currentSkill?.image,
				category_id: category_id ?? currentSkill?.category_id,
				video: videoUrl ?? video ?? currentSkill?.video,
				ingredients: ingredients ?? currentSkill?.ingredients,
				user_id,
			};

			await skillModel.updateSkill(data);

			return response(res, data, 200, "update skill success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// penerapan fitur fe
	getSkillsUserByUserId: async (req, res) => {
		try {
			const user_id = req.params.user_id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			skillModel
				.selectSkillsUserByUserId(user_id)
				.then((result) => {
					return response(res, result.rows, 200, "get user skills success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	createSkill: async (req, res) => {
		try {
			const { name, user_id } = req.body;

			const data = {
				name: name ?? "",
				user_id: user_id ?? null,
			};

			await skillModel.insertSkill(data);

			return response(res, data, 201, "create skill success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deleteSkill: async (req, res) => {
		try {
			const skill_id = req.params.id;

			const { rowCount } = await skillModel.selectSkill(skill_id);
			if (!rowCount) {
				return responseError(res, 404, "Skill id is not found");
			}

			skillModel
				.deleteSkill(skill_id)
				.then(() => {
					return response(res, null, 200, "delete skill success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},
};

module.exports = skillController;
