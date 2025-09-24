import React from "react";
import {
	Paper,
	Typography,
	Box,
	Button,
	Grid,
	Card,
	CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

const EmployeeDashboard = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleNavigate = (path) => {
		navigate(path);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Employee Dashboard
			</Typography>

			<Typography variant="h6" color="text.secondary" gutterBottom>
				Welcome back, {user?.username}!
			</Typography>

			<Grid container spacing={3} sx={{ mt: 2 }}>
				<Grid item xs={12} md={6}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Submit Resignation
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Submit your resignation request with your intended last working
								day.
							</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleNavigate("/employee/resign")}
							>
								Submit Resignation
							</Button>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={6}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Exit Interview
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Complete your exit interview questionnaire after resignation
								approval.
							</Typography>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => handleNavigate("/employee/exit-interview")}
							>
								Fill Exit Interview
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};

export default EmployeeDashboard;
