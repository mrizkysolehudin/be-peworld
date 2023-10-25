const express = require("express");
const router = express.Router();
const hireController = require("../controllers/hireController.js");

router
	.get("/", hireController.getAllHire)
	.get("/hire-worker/:user_id", hireController.getHiresByWorkerId)
	.post("/", hireController.createHire)
	.delete("/:id", hireController.deleteHire)
	// belum
	.get("/:id", hireController.getHire)
	.put("/:id", hireController.updateHire);

module.exports = router;
