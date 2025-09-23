const router = require("express").Router();
const resignationController = require("../controllers/resignation.controller");
const { authenticate } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", (req, res) => res.json({ msg: "hello user" }));
router.post(
	"/resign",
	authenticate,
	authorize("submit_resignation"),
	resignationController.submitResignation
);

module.exports = router;
