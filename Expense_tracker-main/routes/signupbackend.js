const express=require('express')
const router=express.Router();
const signUpController=require('../Controllers/user');

router.post('/signingup',signUpController.signup);

module.exports=router;