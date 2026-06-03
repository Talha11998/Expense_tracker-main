const path = require("path");
const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashfreeService");

const sequelize=require('sequelize');

const Payment = require("../models/paymentModel");

const User = require("../models/users");

exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
};

exports.processPayment = async (req, res) => {

  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerID = req.user.dataValues.id;
  const customerPhone = "9999999998";

  try {

    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone
    );

    // 🚨 IMPORTANT
    if (!paymentSessionId) {
      return res.status(400).json({
        message: "Payment session ID not generated"
      });
    }

    await Payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending",
      customerID,
    });

    res.json({ paymentSessionId, orderId });

  } catch (error) {

    // ✅ THIS is the important log
    console.log(
      "FULL ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Error processing payment",
      error: error.response?.data || error.message
    });
  }
};
exports.getPaymentStatus = async (req, res) => {

  try {
  const orderStatus = await getPaymentStatus(req.params.orderId);
    // Update payment status in the database
  
    const order = await Payment.findOne({ where:{orderId:req.params.orderId} });
    // Update the order's status
    order.paymentStatus = orderStatus;
    await order.save();
    const Id=order.customerID;
    const user = await User.findOne({ where:{id:Id} });
    if(orderStatus==='Success'){
     user.ispremiumuser=true;
     await user.save();
    }
    else{
      user.ispremiumuser=false;
      await user.save();
    }
    res.status(200).json({message:"Payment status updated",data:orderStatus});
   
  } catch (error) {
    console.error("Error fetching payment status:", error.message);
    res.status(500).json({ message: "Error fetching payment status" });
  }
};  