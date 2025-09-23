const authorize = (requiredPermission) => {
	return async (req, res, next) => {
		const userPermissions = req.user.role.permissions.map((p) => p.name);
		if (userPermissions.includes(requiredPermission)) {
			next();
		} else {
			res.status(403).json({ message: "Insufficient permissions" });
		}
	};
};

module.exports = authorize;
