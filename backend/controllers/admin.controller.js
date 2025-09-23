const adminService = require("../services/admin.service");

const getAllResignations = async (req, res) => {
	try {
		const resignations = await adminService.getAllResignations();

		const formattedResignations = resignations.map((resignation) => ({
			_id: resignation._id,
			employeeId: resignation.employee._id,
			lwd: resignation.intended_last_working_day.toISOString().split("T")[0], // Format as YYYY-MM-DD
			status: resignation.status,
		}));

		res.status(200).json({
			data: formattedResignations,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const concludeResignation = async (req, res) => {
	try {
		const { resignationId, approved, lwd, rejectionReason } = req.body;
		const adminId = req.user._id;

		if (!resignationId || typeof approved !== "boolean") {
			return res.status(400).json({
				message: "resignationId and approved (boolean) are required",
			});
		}

		if (approved && !lwd) {
			return res.status(400).json({
				message: "lwd is required when approving resignation",
			});
		}

		if (approved == false && !rejectionReason) {
			return res.status(400).json({
				message: "Rejection Reason is Required",
			});
		}

		await adminService.concludeResignation({
			resignationId,
			approved,
			lwd,
			rejectionReason,
			adminId,
		});

		res.status(200).json();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

module.exports = {
	getAllResignations,
	concludeResignation,
};
