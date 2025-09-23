const router = require("express").Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get("/", (req, res) => res.json({ msg: "hello admin" }));
router.get("/resignations", authenticate, authorize("review_resignations"), adminController.getAllResignations);
router.put("/conclude_resignation", authenticate, authorize("approve_reject_resignations"), adminController.concludeResignation);

module.exports = router;
