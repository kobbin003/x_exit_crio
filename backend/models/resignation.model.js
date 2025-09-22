const mongoose = require("mongoose");

const resignationSchema = new mongoose.Schema(
	{
		employee: { type: ObjectId, ref: "User", required: true },
		reason: { type: String, required: true },
		intended_last_working_day: { type: String, required: true }, // YYYY-MM-DD
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
		// reviewed_by: { type: ObjectId, ref: "User" },
		// reviewed_at: { type: Date },
		rejection_reason: { type: String },
		actual_exit_date: { type: Date },
		// submitted_at: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	}
);

const resignationModel = mongoose.model("Resignation", resignationSchema);

module.exports = resignationModel;
