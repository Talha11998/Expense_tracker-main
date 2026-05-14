const express = require('express');
const ispremiumController = require('../Controllers/ispremium')
const userauthentication = require('../middleware/auth')
const router = express.Router();

router.get('/ispremium', userauthentication.authenticate,  ispremiumController.ispremium);

module.exports = router;