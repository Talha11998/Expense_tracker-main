const express=require('express')
const router=express.Router();
const path=require('path');
const loginController=require('../Controllers/user');

router.post('/user/login',loginController.login);

module.exports=router;