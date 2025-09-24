const ExitInterview = require("../models/exitInterview.model");
const Resignation = require("../models/resignation.model");
const {
	EXIT_INTERVIEW_QUESTIONS,
} = require("../constants/exitInterviewQuestions");

const submitExitInterviewResponses = async (userId, responses) => {
	try {
		// Find the user's approved resignation
		const approvedResignation = await Resignation.findOne({
			employee: userId,
			status: "approved",
		});

		if (!approvedResignation) {
			throw new Error(
				"No approved resignation found. Exit interview is only available after resignation approval."
			);
		}

		// Check if exit interview already exists for this resignation
		const existingInterview = await ExitInterview.findOne({
			resignation: approvedResignation._id,
			employee: userId,
		});

		if (existingInterview && existingInterview.status === "completed") {
			throw new Error(
				"Exit interview has already been completed for this resignation."
			);
		}

		// Validate that all required questions are answered
		const questionTexts = responses.map((r) => r.questionText);

		const missingQuestions = EXIT_INTERVIEW_QUESTIONS.filter(
			(q) => !questionTexts.includes(q)
		);

		if (missingQuestions.length > 0) {
			throw new Error(
				`Missing responses for required questions: ${missingQuestions.join(
					", "
				)}`
			);
		}

		// Validate that only valid questions are answered
		const invalidQuestions = questionTexts.filter(
			(q) => !EXIT_INTERVIEW_QUESTIONS.includes(q)
		);

		if (invalidQuestions.length > 0) {
			throw new Error(
				`Invalid questions provided: ${invalidQuestions.join(", ")}`
			);
		}

		// Validate responses format
		for (const response of responses) {
			if (!response.questionText || !response.response) {
				throw new Error(
					"Each response must have questionText and response fields"
				);
			}

			if (
				typeof response.questionText !== "string" ||
				typeof response.response !== "string"
			) {
				throw new Error("questionText and response must be strings");
			}

			if (response.response.trim().length === 0) {
				throw new Error(
					`Response cannot be empty for question: ${response.question}`
				);
			}
		}

		// Prepare responses for storage
		const formattedResponses = responses.map((r) => ({
			question: r.questionText,
			answer: r.response.trim(),
		}));

		// Create or update exit interview
		if (existingInterview) {
			// Update existing interview
			existingInterview.responses = formattedResponses;
			existingInterview.completed_at = new Date();
			existingInterview.status = "completed";
			await existingInterview.save();
		} else {
			// Create new exit interview
			const exitInterview = new ExitInterview({
				resignation: approvedResignation._id,
				employee: userId,
				responses: formattedResponses,
				completed_at: new Date(),
				status: "completed",
			});
			await exitInterview.save();
		}

		return true;
	} catch (error) {
		throw new Error("Failed to submit exit interview: " + error.message);
	}
};

module.exports = {
	submitExitInterviewResponses,
};
