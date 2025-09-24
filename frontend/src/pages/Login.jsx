import React, { useState } from "react";
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
	Link,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Login = () => {
	const { user, login } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Redirect if already logged in
	if (user) {
		return <Navigate to="/" replace />;
	}

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError(""); // Clear error when user types
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const success = await login(formData);
		if (!success) {
			setError("Login failed. Please check your credentials.");
		}
		setLoading(false);
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
					<Typography component="h1" variant="h4" align="center" gutterBottom>
						XExit Login
					</Typography>

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
							value={formData.username}
							onChange={handleChange}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={formData.password}
							onChange={handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{loading ? "Signing In..." : "Sign In"}
						</Button>
					</Box>

					<Box sx={{ mt: 2, textAlign: "center" }}>
						<Typography variant="body2">
							Don't have an account?{" "}
							<Link
								component="button"
								variant="body2"
								onClick={() => navigate("/register")}
								sx={{ cursor: "pointer" }}
							>
								Register here
							</Link>
						</Typography>
					</Box>

					<Box sx={{ mt: 3, textAlign: "center" }}>
						<Typography variant="body2" color="text.secondary">
							<strong>Demo Info:</strong>
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Employee: any registered user
						</Typography>
						<Typography variant="body2" color="text.secondary">
							HR: user with HR role
						</Typography>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Login;
