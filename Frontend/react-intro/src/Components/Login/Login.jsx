import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [message, setMessage] = useState("");

  // Handle login input changes
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Login function
  const login = async (e) => {
    e.preventDefault();
    console.log(loginData);
    try {
      const response = await axios.post(
        "https://expense-tracker-main-o8jt.onrender.com/user/login",
        loginData,
      );

      alert(response.data.message);

      localStorage.setItem("token", response.data.token);

      window.location.href = "/expenseTracker";
    } catch (err) {
      console.log(err);

      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  // Forgot password function
  const forgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://expense-tracker-main-o8jt.onrender.com/password/forgotpassword",
        {
          email: forgotEmail,
        },
      );

      if (response.status === 202) {
        setMessage("Mail Successfully Sent");
      }
    } catch (err) {
      console.log(err);

      setMessage("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        {message && <p className="message">{message}</p>}

        <form onSubmit={login}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <button
          className="forgot-btn"
          onClick={() => setShowForgotForm(!showForgotForm)}
        >
          Forgot Password?
        </button>

        {showForgotForm && (
          <form onSubmit={forgotPassword} className="forgot-form">
            <div className="form-group">
              <label>Enter your Email</label>

              <input
                type="email"
                placeholder="Enter email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn">
              Submit
            </button>
          </form>
        )}

        <p className="signup-link">
          New User? <a href="/signup">Signup Now</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
