const express = require('express');
const premiumfeatureController = require('../Controllers/premiumfeature');
const router = express.Router();

router.get('/premium/showleaderboard', premiumfeatureController.getUserLeaderBoard);

module.exports = router;