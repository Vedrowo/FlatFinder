import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNum] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(name, email, password, phone_number, role);
    if (data.message === 'User registered successfully') {
      localStorage.setItem("role", data.role)
      localStorage.setItem("user_id", data.user_id)
      navigate("/home");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            placeholder="Phone number"
            value={phone_number}
            onChange={e => setPhoneNum(e.target.value)}
          />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="">Select user type</option>
            <option value="Student">Student</option>
            <option value="Landlord">Landlord</option>
          </select>
          <button type="submit">Register</button>
        </form>
        <p onClick={() => navigate("/")}>Already have an account? Login</p>
      </div>
    </div>
  );
}

export default Register;