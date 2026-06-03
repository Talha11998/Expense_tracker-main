const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authenticate = async(req, res, next) => {
  try {
    let token;

    // From Authorization header
    const authHeader = req.headers.authorization;
    console.log("authHeader",authHeader);
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback: token in body
    if (!token && req.body?.token) {
      token = req.body.token;
    }
    console.log("token",token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded",decoded);
    const user = await User.findByPk(decoded.userId);
  console.log("user",user);
     if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("user",user);

    req.user = user;
    console.log("req.user ",req.user );

    next();
  } catch (err) {
    console.log("error",err);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};


module.exports = {
  authenticate
};