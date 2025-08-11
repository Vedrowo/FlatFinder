import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(email, password);
    if (data.message === "Login successful") {
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_id", data.user.user_id)
      localStorage.setItem("name", data.user.name)
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      navigate("/home");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account?</p>
        <p onClick={() => navigate("/register")}>Register</p>
      </div>
    </div>
  );
}

export default Login;
