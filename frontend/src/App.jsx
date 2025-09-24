import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/employee/Dashboard";
import ResignationForm from "./pages/employee/ResignationForm";
import ExitInterview from "./pages/employee/ExitInterview";
import AdminDashboard from "./pages/admin/Dashboard";
import Resignations from "./pages/admin/Resignations";
import ExitResponses from "./pages/admin/ExitResponses";
import useAuth from "./context/useAuth";
import AuthProvider from "./context/AuthProvider";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
	},
});

const DashboardRedirect = () => {
	const { user, isEmployee, isHR } = useAuth();

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (isEmployee) {
		return <Navigate to="/employee/dashboard" replace />;
	}

	if (isHR) {
		return <Navigate to="/admin/dashboard" replace />;
	}

	return <Navigate to="/login" replace />;
};

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<Router>
					<Layout>
						<Routes>
							{/* Public Routes */}
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />

							{/* Root redirect */}
							<Route path="/" element={<DashboardRedirect />} />

							{/* Employee Routes */}
							<Route
								path="/employee/dashboard"
								element={
									<ProtectedRoute requiredRole="Employee">
										<EmployeeDashboard />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/employee/resign"
								element={
									<ProtectedRoute requiredRole="Employee">
										<ResignationForm />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/employee/exit-interview"
								element={
									<ProtectedRoute requiredRole="Employee">
										<ExitInterview />
									</ProtectedRoute>
								}
							/>

							{/* Admin/HR Routes */}
							<Route
								path="/admin/dashboard"
								element={
									<ProtectedRoute requiredRole="HR">
										<AdminDashboard />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/resignations"
								element={
									<ProtectedRoute requiredRole="HR">
										<Resignations />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/exit-responses"
								element={
									<ProtectedRoute requiredRole="HR">
										<ExitResponses />
									</ProtectedRoute>
								}
							/>

							{/* Catch all route */}
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</Layout>
				</Router>
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: "#363636",
							color: "#fff",
						},
					}}
				/>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
