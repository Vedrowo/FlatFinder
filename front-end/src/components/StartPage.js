import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "0 1rem",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "3rem",
    marginBottom: "0.5rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  };

  const subtitleStyle = {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    fontWeight: "300",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1rem",
  };

  const buttonStyle = {
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "background-color 0.3s ease",
  };

  const registerButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#48bb78", // green
    color: "#fff",
  };

  const loginButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3182ce", // blue
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to FlatFinder</h1>
      <p style={subtitleStyle}>Your one-stop platform for student apartment rentals.</p>
      <div style={buttonGroupStyle}>
        <button
          style={registerButtonStyle}
          onClick={() => navigate("/register")}
          onMouseOver={e => (e.target.style.backgroundColor = "#38a169")}
          onMouseOut={e => (e.target.style.backgroundColor = "#48bb78")}
        >
          Register
        </button>
        <button
          style={loginButtonStyle}
          onClick={() => navigate("/login")}
          onMouseOver={e => (e.target.style.backgroundColor = "#2c5282")}
          onMouseOut={e => (e.target.style.backgroundColor = "#3182ce")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;
