import React from "react";
import axios from "axios";
import "./CashfreePayment.css";

function CashfreePayment() {
  const handlePayment = async () => {
    try {
      if (!window.Cashfree) {
        alert("Cashfree SDK not loaded. Refresh page.");
        return;
      }

      const cashfree = window.Cashfree({
        mode: "sandbox",
      });

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://expense-tracker-main-o8jt.onrender.com/pay", // request body (empty if not needed)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const paymentSessionId = response.data.paymentSessionId;

      const checkoutOptions = {
        paymentSessionId,
        redirectTarget: "_self",
      };

      await cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="payment-container">
      <h1>Cashfree Checkout Integration</h1>

      <div className="payment-card">
        <h3>Click below to open checkout</h3>

        <button onClick={handlePayment}>Pay Now</button>
      </div>
    </div>
  );
}

export default CashfreePayment;
