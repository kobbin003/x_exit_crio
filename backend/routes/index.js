const router = require("express").Router();
const authRouter = require("./auth.router.js");
const userRouter = require("./user.router.js");
const adminRouter = require("./admin.router.js");

router.get("/", (req, res) => res.json({ msg: "hello" }));
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;
