const express = require("express");
const router = express.Router();
const reportController = require("../Controllers/reportControllers");

router.get("/reportdaily", reportController.daily);
router.get("/reportmonthly", reportController.monthly);
router.get("/reportyearly", reportController.yearly);

module.exports = router;
