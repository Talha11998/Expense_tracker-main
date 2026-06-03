import { useState } from 'react'
import Login from './Components/Login/Login.jsx'
import Signup from './Components/Signup/Signup.jsx'
import ExpenseTracker from  './Components/ExpenseTracker/ExpenseTracker.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CashfreePayment from './Components/CashfreePayment/CashfreePayment.jsx'
import Premium from './Components/Premium/Premium.jsx'
import PaymentStatus from "./Components/PaymentStatus/PaymentStatus.jsx";


function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/expensetracker" element={<ExpenseTracker />} />
      <Route path="/CashfreePayment" element={<CashfreePayment />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/payment-status/:orderId" element={<PaymentStatus />} />

    </Routes>
    </BrowserRouter>
  )
}

export default App
