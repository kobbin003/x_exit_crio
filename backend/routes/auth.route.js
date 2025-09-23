const router = require("express").Router();
const authController = require('../controllers/auth.controller');

router.get("/", (req, res) => res.json({ msg: "hello auth" }));
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
