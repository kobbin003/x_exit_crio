const exitInterviewService = require("../services/exitInterview.service");

const submitResponses = async (req, res) => {
	try {
		const { responses } = req.body;
		// responses structure: {question:String; answer:String}[]
		const userId = req.user._id;

		if (!responses || !Array.isArray(responses)) {
			return res.status(400).json({
				message: "responses array is required",
			});
		}

		if (responses.length === 0) {
			return res.status(400).json({
				message: "At least one response is required",
			});
		}

		await exitInterviewService.submitExitInterviewResponses(userId, responses);

		res.status(200).json();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	submitResponses,
};
