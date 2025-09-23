const resignationService = require("../services/resignation.service");

const submitResignation = async (req, res) => {
	try {
		const { lwd, reason } = req.body;

		const userId = req.user._id;

		if (!lwd) {
			return res
				.status(400)
				.json({ message: "Last working day (lwd) is required" });
		}

		const resignation = await resignationService.submitResignation(
			userId,
			lwd,
			reason
		);

		res.status(200).json({
			data: {
				resignation: {
					_id: resignation._id,
				},
			},
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	submitResignation,
};
