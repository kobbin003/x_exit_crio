const authService = require("../services/auth.service");

const register = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password are required" });
		}

		await authService.registerUser(username, password);

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: "Username and password are required" });
		}

		const token = await authService.loginUser(username, password);

		res.status(200).json({ token });
	} catch (error) {
		res.status(401).json({ message: error.message });
	}
};

module.exports = {
	register,
	login,
};
