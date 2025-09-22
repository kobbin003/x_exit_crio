const router = require("express").Router();

router.get("/", (req, res) => res.json({ msg: "hello admin" }));

module.exports = router;
