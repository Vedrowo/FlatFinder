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
    backgroundColor: "#AEC8A4", 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "2rem",
    textAlign: "center",
  };

  const cardStyle = {
    backgroundColor: "#E7EFC7", 
    padding: "3rem 4rem",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    maxWidth: "480px",
    width: "100%",
  };

  const titleStyle = {
    fontSize: "2.8rem",
    marginBottom: "1rem",
    color: "#8A784E", // warm brown
    fontWeight: "700",
  };

  const subtitleStyle = {
    fontSize: "1.3rem",
    marginBottom: "5rem",
    color: "#3B3B1A", // deep olive green
    fontWeight: "500",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
  };

  const buttonStyle = {
    padding: "0.85rem 2.5rem",
    fontSize: "1.1rem",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease",
  };

  const registerButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#8A784E", // warm brown
    color: "white",
  };

  const loginButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3B3B1A", // dark olive green
    color: "white",
  };


  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Welcome to FlatFinder</h1>
        <p style={subtitleStyle}>Simplifying student living.</p>
        <div style={buttonGroupStyle}>
          <button
            style={registerButtonStyle}
            onClick={() => navigate("/register")}
            onMouseOver={e => (e.target.style.backgroundColor = "#7a6a3f")}
            onMouseOut={e => (e.target.style.backgroundColor = "#8A784E")}
          >
            Register
          </button>
          <button
            style={loginButtonStyle}
            onClick={() => navigate("/login")}
            onMouseOver={e => (e.target.style.backgroundColor = "#323319")}
            onMouseOut={e => (e.target.style.backgroundColor = "#3B3B1A")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
