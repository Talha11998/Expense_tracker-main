import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PaymentStatus() {
  const { orderId } = useParams();
  const [status, setStatus] = useState("loading"); 
  // loading | success | failed

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/payment-status/${orderId}`
        );
        console.log("res.data",res.data);
        if (res.data.data === "Success") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("failed");
      }
    };

    if (orderId) {
      verifyPayment();
    }
  }, [orderId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {status === "loading" && <h2>Verifying payment...</h2>}
      {status === "success" && <h2>✅ Payment Successful</h2>}
      {status === "failed" && <h2>❌ Payment Failed</h2>}
    </div>
  );
}

export default PaymentStatus;