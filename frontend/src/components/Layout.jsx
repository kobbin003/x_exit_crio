import React from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Layout = ({ children }) => {
	const { user, logout, isEmployee, isHR } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handleNavigation = (path) => {
		navigate(path);
	};

	return (
		<Box sx={{ width: '100vw', minHeight: '100vh' }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						XExit - Employee Resignation System
					</Typography>

					{user && (
						<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
							<Typography variant="body2">
								Welcome, {user.username} ({user.role})
							</Typography>

							{isEmployee && (
								<>
									<Button
										color="inherit"
										onClick={() => handleNavigation("/employee/dashboard")}
									>
										Dashboard
									</Button>
									<Button
										color="inherit"
										onClick={() => handleNavigation("/employee/resign")}
									>
										Submit Resignation
									</Button>
									<Button
										color="inherit"
										onClick={() => handleNavigation("/employee/exit-interview")}
									>
										Exit Interview
									</Button>
								</>
							)}

							{isHR && (
								<>
									<Button
										color="inherit"
										onClick={() => handleNavigation("/admin/dashboard")}
									>
										Dashboard
									</Button>
									<Button
										color="inherit"
										onClick={() => handleNavigation("/admin/resignations")}
									>
										Resignations
									</Button>
									<Button
										color="inherit"
										onClick={() => handleNavigation("/admin/exit-responses")}
									>
										Exit Responses
									</Button>
								</>
							)}

							<Button color="inherit" onClick={handleLogout}>
								Logout
							</Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			<Box sx={{
				mt: 4,
				mb: 4,
				px: 3,
				width: '100vw'
			}}>
				{children}
			</Box>
		</Box>
	);
};

export default Layout;
