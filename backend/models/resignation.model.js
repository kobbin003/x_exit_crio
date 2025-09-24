const mongoose = require("mongoose");

const resignationSchema = new mongoose.Schema(
	{
		employee: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reason: { type: String },
		intended_last_working_day: { type: Date, required: true },
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},

		// these are to be set while concluding resignation by the employee
		reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		reviewed_at: { type: Date },
		rejection_reason: { type: String },
		actual_exit_date: { type: Date },
	},
	{
		timestamps: true,
	}
);

const resignationModel = mongoose.model("Resignation", resignationSchema);

module.exports = resignationModel;
