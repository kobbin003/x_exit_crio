const Resignation = require("../models/resignation.model");
const { isHoliday } = require("../utils/holidayService");

const submitResignation = async (userId, lwd, reason) => {
	// Check if user already has a pending resignation
	const existingResignation = await Resignation.findOne({
		employee: userId,
		status: "pending",
	});

	if (existingResignation) {
		throw new Error("You already have a pending resignation request");
	}

	// Validate date format and ensure it's a future date
	const lwdDate = new Date(lwd);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (isNaN(lwdDate.getTime())) {
		throw new Error("Invalid date format. Please use YYYY-MM-DD format");
	}

	if (lwdDate <= today) {
		throw new Error("Last working day must be a future date");
	}

	// Check if the date falls on weekend
	const dayOfWeek = lwdDate.getDay();
	if (dayOfWeek === 0 || dayOfWeek === 6) {
		throw new Error("Last working day cannot be on weekends");
	}

	// Check if the date falls on holidays
	const holidayCheck = await isHoliday(lwdDate, "IN");

	if (holidayCheck.isHoliday) {
		throw new Error(`Last working day cannot be on a holiday`);
	}
	// Create resignation
	const resignation = new Resignation({
		employee: userId,
		intended_last_working_day: lwdDate,
		status: "pending",
		reason,
	});

	await resignation.save();
	return resignation;
};

module.exports = {
	submitResignation,
};
