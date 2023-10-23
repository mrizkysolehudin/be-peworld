const path = require("path");
const multer = require("multer");
const { responseError } = require("../helpers/response");

const multerUpload = multer({
	storage: multer.diskStorage({
		// destination: function (req, file, cb) {
		// 	cb(null, "./public");
		// },
		filename: function (req, file, cb) {
			const ext = path.extname(file.originalname);
			const fileName = `${Date.now()}${ext}`;
			cb(null, fileName);
		},
	}),

	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);

		if (file.fieldname === "image") {
			if (ext == ".png" || ext == ".jpg" || ext == ".jpeg") {
				cb(null, true);
			} else {
				const errMessage = {
					message: "File must be a .PNG, .JPG, or .JPEG",
				};

				return cb(errMessage, false);
			}

			const maxSizeImage = 2 * 1024 * 1024;
			if (file.size > maxSizeImage) {
				const errMessage = {
					message: "File size should be less than 2MB",
				};

				return cb(errMessage, false);
			} else {
				cb(null, true);
			}
		} else if (file.fieldname === "video") {
			const ext = path.extname(file.originalname);
			const maxSizeVideo = 50 * 1024 * 1024;
			if (ext == ".3gp" || ext == ".mpeg" || ext == ".mp4") {
				if (file.size > maxSizeVideo) {
					const error = {
						message: "File size exceeds 50 MB",
					};
					return cb(error, false);
				} else {
					cb(null, true);
				}
			} else {
				const error = {
					message: "File must be mp4 or mpeg",
				};
				cb(error, false);
			}
		}
	},
});

const uploadImageAndVideoRecipe = (req, res, next) => {
	const multerFields = multerUpload.fields([
		{ name: "video", maxCount: 1 },
		{ name: "image", maxCount: 1 },
	]);

	multerFields(req, res, (err) => {
		if (err) {
			return responseError(res, 413, "Error when upload file: " + err.message);
		} else {
			next();
		}
	});
};

const uploadPhotoProfile = (req, res, next) => {
	const multerSingle = multerUpload.single("photo");

	multerSingle(req, res, (err) => {
		if (err) {
			return responseError(res, 413, "Error when upload file: " + err.message);
		} else {
			next();
		}
	});
};

module.exports = { uploadImageAndVideoRecipe, uploadPhotoProfile };
