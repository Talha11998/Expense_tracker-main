const express = require('express');
const ispremiumController = require('../Controllers/ispremium')
const {authenticate} = require('../middleware/auth')
const router = express.Router();

router.get('/ispremium',authenticate,  ispremiumController.ispremium);

module.exports = router;