const express = require("express");
const router = express.Router();
const workExperiecesController = require("../controllers/workExperieceController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router
	.get("/", workExperiecesController.getAllWorkExperiences)
	.get(
		"/user-workexperience/:user_id",
		workExperiecesController.getWorkExperiencesUserByUserId,
	)
	.post("/", uploadImage, workExperiecesController.createWorkExperience)
	.delete("/:id", workExperiecesController.deleteWorkExperience)
	// belum
	.get("/:id", workExperiecesController.getWorkExperience)
	.put("/:id", uploadImage, workExperiecesController.updateWorkExperience);

module.exports = router;
