const cloudinary = require("../helpers/cloudinary.js");
const { response, responseError } = require("../helpers/response.js");
const portfolioModel = require("../models/portfolioModel.js");
const userModel = require("../models/userModel.js");

const portfolioController = {
	getAllPortfolios: async (req, res) => {
		let search = req.query.search || "";
		let sort = req.query.sort || "ASC";

		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let offset = (page - 1) * limit;

		const resultCount = await portfolioModel.countDataPortfolio();
		const { count } = resultCount.rows[0];

		const totalData = parseInt(count);
		const totalPage = Math.ceil(totalData / limit);
		const pagination = {
			currentPage: page,
			limit,
			totalData,
			totalPage,
		};

		portfolioModel
			.selectAllPortfolios(search, sort, limit, offset)
			.then((result) => {
				return response(
					res,
					result.rows,
					200,
					"get portfolios success",
					pagination,
				);
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	getPortfolio: async (req, res) => {
		const portfolio_id = req.params.id;

		portfolioModel
			.selectPortfolio(portfolio_id)
			.then((result) => {
				let { rowCount } = result;
				if (!rowCount) {
					return responseError(res, 404, "Portfolio id is not found");
				}

				return response(res, result.rows, 200, "get portfolio success");
			})
			.catch((error) => {
				return responseError(res, 500, error.message);
			});
	},

	updatePortfolio: async (req, res) => {
		try {
			const portfolio_id = req.params.id;

			const { title, description, category_id, ingredients, video, user_id } =
				req.body;

			let imageUrl = "";
			if (req.files.image) {
				const uploadImageToCloudinary = await cloudinary.uploader.upload(
					req.files?.image?.[0].path,
					{
						folder: "mama_portfolio/portfolio",
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
						folder: "mama_portfolio/portfolio/video",
						resource_type: "video",
					},
				);
				if (!uploadVideoToCloudinary) {
					return responseError(res, 400, "upload video failed");
				}
				videoUrl = uploadVideoToCloudinary?.secure_url ?? "";
			}

			const { rowCount, rows } = await portfolioModel.selectPortfolio(
				portfolio_id,
			);
			if (!rowCount) {
				return responseError(res, 404, "Portfolio id is not found");
			}

			const currentPortfolio = rows[0];

			const data = {
				portfolio_id,
				title: title ?? currentPortfolio?.title,
				description: description ?? currentPortfolio?.description,
				image: imageUrl ?? currentPortfolio?.image,
				category_id: category_id ?? currentPortfolio?.category_id,
				video: videoUrl ?? video ?? currentPortfolio?.video,
				ingredients: ingredients ?? currentPortfolio?.ingredients,
				user_id,
			};

			await portfolioModel.updatePortfolio(data);

			return response(res, data, 200, "update portfolio success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	// penerapan fitur fe
	getPortfoliosUserByUserId: async (req, res) => {
		try {
			const user_id = req.params.user_id;

			const { rowCount } = await userModel.selectUser(user_id);
			if (!rowCount) {
				return responseError(res, 404, "User id is not found");
			}

			portfolioModel
				.selectPortfoliosUserByUserId(user_id)
				.then((result) => {
					return response(res, result.rows, 200, "get user portfolios success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	createPortfolio: async (req, res) => {
		try {
			const { name, type, image, link, user_id } = req.body;

			let imageUrl = "";
			if (req.file) {
				const uploadToCloudinary = await cloudinary.uploader.upload(
					req?.file?.path,
					{
						folder: "peworld/portfolio",
					},
				);

				if (!uploadToCloudinary) {
					return responseError(res, 400, "upload image failed");
				}
				imageUrl = uploadToCloudinary?.secure_url ?? "";
			}

			const data = {
				name: name ?? "",
				type: type ?? "",
				image: image ?? "",
				link: link ?? "",
				user_id: user_id ?? "",
			};

			await portfolioModel.insertPortfolio(data);

			return response(res, data, 201, "create portfolio success");
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},

	deletePortfolio: async (req, res) => {
		try {
			const portfolio_id = req.params.id;

			const { rowCount } = await portfolioModel.selectPortfolio(portfolio_id);
			if (!rowCount) {
				return responseError(res, 404, "Portfolio id is not found");
			}

			portfolioModel
				.deletePortfolio(portfolio_id)
				.then(() => {
					return response(res, null, 200, "delete portfolio success");
				})
				.catch((error) => {
					return responseError(res, 500, error.message);
				});
		} catch (error) {
			return responseError(res, 500, error.message);
		}
	},
};

module.exports = portfolioController;
