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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Register = () => {
	const { user, register } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		role: "Employee", // Default to Employee
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

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		// Validate password length
		if (formData.password.length < 5) {
			setError("Password must be at least 5 characters long");
			setLoading(false);
			return;
		}

		const success = await register({
			username: formData.username,
			password: formData.password,
			role: formData.role,
		});

		if (success) {
			navigate("/login");
		} else {
			setError("Registration failed. Please try again.");
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
						Create Account
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
							autoComplete="new-password"
							value={formData.password}
							onChange={handleChange}
							helperText="Minimum 5 characters"
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
						<FormControl fullWidth margin="normal" required>
							<InputLabel id="role-label">Role</InputLabel>
							<Select
								labelId="role-label"
								id="role"
								name="role"
								value={formData.role}
								label="Role"
								onChange={handleChange}
							>
								<MenuItem value="Employee">Employee</MenuItem>
								<MenuItem value="HR">HR</MenuItem>
							</Select>
						</FormControl>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{loading ? "Creating Account..." : "Register"}
						</Button>
					</Box>

					<Box sx={{ mt: 2, textAlign: "center" }}>
						<Typography variant="body2">
							Already have an account?{" "}
							<Link
								component="button"
								variant="body2"
								onClick={() => navigate("/login")}
								sx={{ cursor: "pointer" }}
							>
								Sign in here
							</Link>
						</Typography>
					</Box>

					<Box
						sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}
					>
						<Typography variant="body2" color="text.secondary">
							<strong>Note:</strong> Choose your role carefully. Employee role
							is for regular staff members, while HR role is for Human Resources
							personnel with administrative privileges.
						</Typography>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Register;
