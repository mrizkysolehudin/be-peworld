const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const { uploadPhotoProfile } = require("../middlewares/uploadImage.js");
// const hitById = require("../helpers/hitByRedis.js");

router
	.get("/", userController.getAllUsers)
	.post("/login", userController.loginUser)
	.put("/:id", uploadPhotoProfile, userController.updateUser)
	.delete("/:id", userController.deleteUser)
	.post("/recruiter/register", userController.registerRecruiter)
	.get("/worker", userController.getAllWorkers)
	.post("/worker/register", userController.registerWorker)
	.get("/:id", userController.getUser);

// .get("/getFromRedis/:id", hitById, userController.getById);

module.exports = router;
