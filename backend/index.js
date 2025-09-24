const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();
const { connect } = require("mongoose");
const taskRoutes = require("./routes");
// const { seedRolesAndPermissions } = require("./utils/seed");
require("./middleware/auth"); // Initialize passport strategies

const app = express();
const PORT = process.env.PORT;
const DB_URI = process.env.MONGODB_URL;

connect(DB_URI)
	.then(() => {
		console.log("DB Connected!");
		// NOTE: seedRolesAndPermissions is to be run only once. since the data of these models are constant.
		// seedRolesAndPermissions().then(() =>
		// 	console.log("roles and permissions seeded..")
		// );
		app.listen(PORT, () => {
			console.log(`Backend listening on ${PORT}`);
		});
	})
	.catch((error) => console.log("Error in connecting DB", error));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// logger middleware...
app.use((req, res, next) => {
	console.log(
		`${req.method} call at ${req.url} ${req.body ? "with" : "without"} body `
	);
	// console.log(req.body);
	next();
});

app.use("/api", taskRoutes);
