const mongoose = require("mongoose");

const exitInterviewSchema = new mongoose.Schema({
	resignation: { type: mongoose.Schema.Types.ObjectId, ref: "Resignation", required: true },
	employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	responses: [
		{
			question: { type: String, required: true },
			answer: { type: String, required: true },
		},
	],
	completed_at: { type: Date },
	status: {
		type: String,
		enum: ["pending", "completed"],
		default: "pending",
	},
}, {
	timestamps: true
});

const exitInterviewModel = mongoose.model("ExitInterview", exitInterviewSchema);

module.exports = exitInterviewModel;
