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

const AdminDashboard = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleNavigate = (path) => {
		navigate(path);
	};

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				HR Dashboard
			</Typography>

			<Typography variant="h6" color="text.secondary" gutterBottom>
				Welcome back, {user?.username}!
			</Typography>

			<Grid container spacing={3} sx={{ mt: 2 }}>
				<Grid item xs={12} md={6}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Manage Resignations
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Review, approve, or reject employee resignation requests.
							</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleNavigate("/admin/resignations")}
							>
								View Resignations
							</Button>
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={6}>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Exit Interview Responses
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Review completed exit interview questionnaires from employees.
							</Typography>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => handleNavigate("/admin/exit-responses")}
							>
								View Responses
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Paper sx={{ p: 3, mt: 4 }}>
				<Typography variant="h6" gutterBottom>
					Quick Actions
				</Typography>
				<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
					<Button
						variant="outlined"
						onClick={() => handleNavigate("/admin/resignations")}
					>
						Review Resignations
					</Button>
					<Button
						variant="outlined"
						onClick={() => handleNavigate("/admin/exit-responses")}
					>
						View Exit Interviews
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default AdminDashboard;
