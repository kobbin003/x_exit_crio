const permissionModel = require("../models/permission.model.js");
const Role = require("../models/role.model.js");

async function seedRolesAndPermissions() {
	try {
		// Empty existing data
		await Role.deleteMany({});
		await permissionModel.deleteMany({});
		console.log("Cleared existing roles and permissions data");

		// Create permissions
		const permissionData = [
			{ name: "submit_resignation", description: "Submit resignation request" },
			{
				name: "receive_resignation_status_notification",
				description:
					"Receive notifications for approval/rejection of resignation",
			},
			{
				name: "view_resignation_status",
				description: "View resignation status",
			},
			{
				name: "fill_exit_interview",
				description: "Fill exit interview questionnaire",
			},
			{
				name: "review_resignations",
				description: "Review resignation requests",
			},
			{
				name: "approve_reject_resignations",
				description: "Approve/reject resignations",
			},
			{ name: "set_exit_dates", description: "Set exit dates" },
			{
				name: "view_exit_interviews",
				description: "View completed exit interviews",
			},
		];

		const permissions = await permissionModel.insertMany(permissionData);
		console.log("Permissions created successfully");

		// Create a map for easy lookup
		const permissionMap = {};
		permissions.forEach((permission) => {
			permissionMap[permission.name] = permission._id;
		});

		// Create roles using the permission IDs
		await Role.insertMany([
			{
				name: "Employee",
				permissions: [
					permissionMap["submit_resignation"],
					permissionMap["view_resignation_status"],
					permissionMap["fill_exit_interview"],
				],
			},
			{
				name: "HR",
				permissions: [
					permissionMap["review_resignations"],
					permissionMap["approve_reject_resignations"],
					permissionMap["set_exit_dates"],
					permissionMap["view_exit_interviews"],
				],
			},
		]);
		console.log("Roles created successfully");
		console.log("Roles and permissions seeded successfully!");
	} catch (error) {
		console.error("Error seeding roles and permissions:", error);
	}
}

module.exports.seedRolesAndPermissions = seedRolesAndPermissions;
