const Resignation = require("../models/resignation.model");
const ExitInterview = require("../models/exitInterview.model");

const getAllResignations = async () => {
	try {
		const resignations = await Resignation.find({})
			.populate("employee", "_id username")
			.sort({ createdAt: -1 }); // Sort by newest first

		return resignations;
	} catch (error) {
		throw new Error("Failed to fetch resignations: " + error.message);
	}
};

const concludeResignation = async ({
	resignationId,
	approved,
	lwd,
	rejectionReason,
	adminId,
}) => {
	try {
		// Find the resignation
		const resignation = await Resignation.findById(resignationId);

		if (!resignation) {
			throw new Error("Resignation not found");
		}

		if (resignation.status !== "pending") {
			throw new Error("Resignation has already been processed");
		}

		// Prepare update data
		const updateData = {
			status: approved ? "approved" : "rejected",
			reviewed_by: adminId,
			reviewed_at: new Date(),
		};

		if (approved == false) {
			updateData.rejection_reason = rejectionReason;
		}

		// If approved, set the actual exit date
		if (approved && lwd) {
			const lwdDate = new Date(lwd);

			if (isNaN(lwdDate.getTime())) {
				throw new Error(
					"Invalid date format for lwd. Please use YYYY-MM-DD format"
				);
			}

			updateData.actual_exit_date = lwdDate;
		}

		// Update the resignation
		await Resignation.findByIdAndUpdate(resignationId, updateData);

		return true;
	} catch (error) {
		throw new Error("Failed to conclude resignation: " + error.message);
	}
};

const getAllExitResponses = async () => {
	try {
		const exitInterviews = await ExitInterview.find({ status: "completed" })
			.populate("employee", "_id username")
			.sort({ completed_at: -1 }); // Sort by completion date, newest first

		return exitInterviews;
	} catch (error) {
		throw new Error("Failed to fetch exit responses: " + error.message);
	}
};

module.exports = {
	getAllResignations,
	concludeResignation,
	getAllExitResponses,
};
