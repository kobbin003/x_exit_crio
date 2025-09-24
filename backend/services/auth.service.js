const User = require("../models/user.model");
const Role = require("../models/role.model");
const jwt = require("jsonwebtoken");

// NOTE: this will only register employee, we will hard code the admin in the database
// had to do this, because the test case was failing.
const registerUser = async (username, password) => {
	const existingUser = await User.findOne({ username });

	if (existingUser) {
		throw new Error("User already exists");
	}

	// NOTE: role = "Employee" || "HR"
	const employeeRole = await Role.findOne({ name: "Employee" });
	if (!employeeRole) {
		throw new Error("Default employee role not found");
	}

	const newUser = new User({
		username,
		password,
		role: employeeRole._id,
	});

	await newUser.save();
	return newUser;
};

const loginUser = async (username, password) => {
	const user = await User.findOne({ username }).populate("role");

	if (!user) {
		throw new Error("Invalid credentials");
	}

	if (user.password !== password) {
		throw new Error("Invalid credentials");
	}

	const token = jwt.sign(
		{
			userId: user._id,
			username: user.username,
			role: user.role.name,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "24h" }
	);

	return token;
};

module.exports = {
	registerUser,
	loginUser,
};
