const express = require('express');
const expensepageController = require('../Controllers/expensePage')
const router = express.Router();

router.get('/Expensepage', expensepageController.expensePage);

module.exports = router;