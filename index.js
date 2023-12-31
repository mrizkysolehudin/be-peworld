const express = require("express");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const userRoute = require("./src/routes/userRoute.js");
const portfolioRoute = require("./src/routes/portfolioRoute.js");
const skillRoute = require("./src/routes/skillRoute.js");
const workExperieceRoute = require("./src/routes/workExperieceRoute.js");
const hireRoute = require("./src/routes/hireRoute.js");

const PORT = process.env.PORT;
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(cookieParser());

// routes
app.use("/user", userRoute);
app.use("/portfolio", portfolioRoute);
app.use("/workexperience", workExperieceRoute);
app.use("/skill", skillRoute);
app.use("/hire", hireRoute);

app.listen(PORT, () => {
	console.log(`Server berjalan di PORT: ${PORT}`);
});
