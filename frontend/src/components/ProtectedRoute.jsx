import React from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import useAuth from "../context/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (requiredRole && user.role !== requiredRole) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
