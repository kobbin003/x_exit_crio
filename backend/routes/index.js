const router = require("express").Router();
const authRouter = require("./auth.route.js");
const userRouter = require("./user.router.js");
const adminRouter = require("./admin.route.js");

router.get("/", (req, res) => res.json({ msg: "hello" }));
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;
