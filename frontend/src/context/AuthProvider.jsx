import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for existing token and user data
		const token = localStorage.getItem("token");
		const userData = localStorage.getItem("user");

		if (token && userData) {
			setUser(JSON.parse(userData));
		}
		setLoading(false);
	}, []);

	const login = async (credentials) => {
		try {
			const response = await authAPI.login(credentials);
			const { token } = response.data;

			// Decode token to get user info (simple JWT decode)
			const payload = JSON.parse(atob(token.split(".")[1]));
			const userData = {
				userId: payload.userId,
				username: payload.username,
				role: payload.role,
			};

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(userData));
			setUser(userData);

			toast.success("Login successful!");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || "Login failed");
			return false;
		}
	};

	const register = async (userData) => {
		try {
			await authAPI.register(userData);
			toast.success("Registration successful! Please login.");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || "Registration failed");
			return false;
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		toast.success("Logged out successfully");
	};

	const value = {
		user,
		loading,
		login,
		register,
		logout,
		isEmployee: user?.role === "Employee",
		isHR: user?.role === "HR",
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
