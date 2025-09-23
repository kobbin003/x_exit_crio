const axios = require("axios");

const isHoliday = async (date, country = "US") => {
	try {
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // JavaScript months are 0-indexed
		const day = date.getDate();

		console.log(year, "-", month, "-", day);
		const apiKey = process.env.CALENDARIFIC_API_KEY;
		const url = `https://calendarific.com/api/v2/holidays`;

		const params = {
			api_key: apiKey,
			country: country,
			year: year,
			month: month,
			day: day,
		};

		const response = await axios.get(url, { params });

		if (response.data.meta.code !== 200) {
			console.error("Calendarific API error:", response.data.meta);
			throw new Error("Failed to fetch holiday data");
		}

		const holidays = response.data.response.holidays;

		return {
			isHoliday: holidays.length > 0,
		};
	} catch (error) {
		console.error("Error checking holiday:", error.message);
		// Return false if API fails - don't block resignations due to API issues
		return {
			isHoliday: false,
		};
	}
};

module.exports = {
	isHoliday,
};
