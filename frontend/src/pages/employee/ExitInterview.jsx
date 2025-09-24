import React, { useState } from "react";
import {
	Paper,
	Typography,
	TextField,
	Button,
	Box,
	Alert,
} from "@mui/material";
import { employeeAPI } from "../../services/api";
import { EXIT_INTERVIEW_QUESTIONS } from "../../constants/exitQuestions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ExitInterview = () => {
	const navigate = useNavigate();
	const [responses, setResponses] = useState(
		EXIT_INTERVIEW_QUESTIONS.reduce((acc, question) => {
			acc[question] = "";
			return acc;
		}, {})
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleChange = (question, value) => {
		setResponses({
			...responses,
			[question]: value,
		});
		setError(""); // Clear error when user types
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log("responses: ", responses);
		// return;
		setLoading(true);
		setError("");

		// Validate all questions are answered
		const unansweredQuestions = EXIT_INTERVIEW_QUESTIONS.filter(
			(question) => !responses[question]?.trim()
		);

		if (unansweredQuestions.length > 0) {
			setError("Please answer all questions before submitting.");
			setLoading(false);
			return;
		}

		try {
			// Format responses for API
			const formattedResponses = EXIT_INTERVIEW_QUESTIONS.map((question) => ({
				questionText: question,
				response: responses[question].trim(),
			}));

			// console.log("formattedResponses: ", formattedResponses);
			await employeeAPI.submitExitInterview(formattedResponses);
			setSuccess(true);
			toast.success("Exit interview submitted successfully!");

			// Navigate back to dashboard after a short delay
			setTimeout(() => {
				navigate("/employee/dashboard");
			}, 3000);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Failed to submit exit interview";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<Box>
				<Alert severity="success" sx={{ mb: 3 }}>
					<Typography variant="h6">
						Exit Interview Submitted Successfully!
					</Typography>
					<Typography>
						Thank you for taking the time to complete the exit interview. Your
						feedback is valuable to us. You will be redirected to the dashboard
						shortly.
					</Typography>
				</Alert>
			</Box>
		);
	}

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Exit Interview Questionnaire
			</Typography>

			<Paper sx={{ p: 4 }}>
				<Typography variant="h6" gutterBottom>
					Please take a few minutes to share your feedback
				</Typography>

				<Typography variant="body2" color="text.secondary" paragraph>
					Your responses will help us improve our workplace and employee
					experience. All responses are confidential.
				</Typography>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
					{EXIT_INTERVIEW_QUESTIONS.map((question, index) => (
						<TextField
							key={index}
							margin="normal"
							required
							fullWidth
							id={`question-${index}`}
							label={`Question ${index + 1}`}
							name={`question-${index}`}
							multiline
							rows={3}
							value={responses[question]}
							onChange={(e) => handleChange(question, e.target.value)}
							helperText={question}
							sx={{ mb: 3 }}
						/>
					))}

					<Box sx={{ display: "flex", gap: 2, mt: 4 }}>
						<Button
							type="submit"
							variant="contained"
							disabled={loading}
							sx={{ minWidth: 120 }}
						>
							{loading ? "Submitting..." : "Submit Interview"}
						</Button>
						<Button
							variant="outlined"
							onClick={() => navigate("/employee/dashboard")}
							disabled={loading}
						>
							Cancel
						</Button>
					</Box>
				</Box>

				<Box sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
					<Typography variant="body2" color="text.secondary">
						<strong>Note:</strong> Exit interview can only be completed after
						your resignation has been approved by HR. All questions must be
						answered to submit the interview.
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
};

export default ExitInterview;
