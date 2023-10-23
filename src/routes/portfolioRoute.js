const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController.js");
const { uploadImage } = require("../middlewares/uploadImage.js");

router
	.get("/", portfolioController.getAllPortfolios)
	.get("/user-portfolio/:user_id", portfolioController.getPortfoliosUserByUserId)
	.post("/", uploadImage, portfolioController.createPortfolio)
	.delete("/:id", portfolioController.deletePortfolio)
	// belum
	.get("/:id", portfolioController.getPortfolio)
	.put("/:id", uploadImage, portfolioController.updatePortfolio);

module.exports = router;
