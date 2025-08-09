import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Apartments from "./components/Apartments";
import Home from "./components/Home"
import StartPage from "./components/StartPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apartments" element={<Apartments />} />
      </Routes>
    </Router>
  );
}

export default App;
