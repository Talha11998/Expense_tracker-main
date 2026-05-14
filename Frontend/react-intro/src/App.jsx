import { useState } from 'react'
import Login from './Components/Login.jsx'
import Signup from './Components/Signup.jsx'
import ExpenseTracker from  './Components/ExpenseTracker.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CashfreePayment from './Components/CashfreePayment.jsx'
import Premium from './Components/Premium.jsx'

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/expensetracker" element={<ExpenseTracker />} />
      <Route path="/CashfreePayment" element={<CashfreePayment />} />
      <Route path="/premium" element={<Premium />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
