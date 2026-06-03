const express = require('express');
const premiumfeatureController = require('../Controllers/premiumfeature');
const router = express.Router();
const {authenticate}=require('../middleware/auth');

router.get('/premium/showleaderboard', premiumfeatureController.getUserLeaderBoard);
router.get('/premium/fetchMonthlydata',authenticate, premiumfeatureController.fetchmonthlydata);
router.post('/premium/addIncome',authenticate,premiumfeatureController.addIncome);

module.exports = router;