const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router
	.get("/", skillController.getAllSkills)
	.get("/user-skill/:user_id", skillController.getSkillsUserByUserId)
	.post("/", uploadImage, skillController.createSkill)
	.delete("/:id", skillController.deleteSkill)
	// belum
	.get("/:id", skillController.getSkill)
	.put("/:id", uploadImage, skillController.updateSkill);

module.exports = router;
