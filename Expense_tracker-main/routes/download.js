const express = require('express');
const userauthentication = require('../middleware/auth')
const router = express.Router();
const downloadController=require('../Controllers/expense');

router.get('/user/download', userauthentication.authenticate ,  downloadController.downloadexpense);

module.exports = router;