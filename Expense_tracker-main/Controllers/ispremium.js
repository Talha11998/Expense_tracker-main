const User = require("../models/users");


exports.ispremium = async (req,res) =>{
        try{
        const user = await User.findOne({ where : { id : req.user.dataValues.id}});        
        let a=user.ispremiumuser;
        return res.status(200).json({a});
       }
       catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
       }

}