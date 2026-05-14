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
  const customerID = "2";
  const customerPhone = "9999999998";

  try {
    //* Create an order in Cashfree and get the payment session ID
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone,

    );

    //* Save payment details to the database
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
    console.error("Error processing payment:", error.message);
    res.status(500).json({ message: "Error processing payment" });
  }
};

exports.getPaymentStatus = async (req, res) => {

  try {
    const orderStatus = await getPaymentStatus(req.params.orderId);

    // Update payment status in the database
  
    const order = await Payment.findOne({ where:{orderId:req.params.orderId} });
    console.log("order1",order);
    // Update the order's status
    order.paymentStatus = orderStatus;
    await order.save();
    const Id=order.customerID;
    const user = await User.findOne({ where:{id:Id} });
    if(orderStatus==='Success'){
     user.ispremiumuser='true';
     await user.save();
    }
    else{
      user.ispremiumuser='false';
      await user.save();
    }

   
  } catch (error) {
    console.error("Error fetching payment status:", error.message);
    res.status(500).json({ message: "Error fetching payment status" });
  }
};  