const User = require("../models/users");


exports.ispremium = async (req,res) =>{
        const user = await User.findOne({ where : { id : req.user.id}});
        let a=user.ispremiumuser;
        console.log("Talha",a);
        return res.status(200).json({a});
}