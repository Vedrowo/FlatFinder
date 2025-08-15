import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Apartments from "./components/Apartments";
import MyApartments from "./components/MyApartments"
import Home from "./components/Home"
import StartPage from "./components/StartPage"
import StudentListings from "./components/StudentListings";
import MyListings from "./components/MyListings";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile"
import ApartmentDetail from './components/ApartmentDetail';
import Messages from './components/Messages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/my-apartments" element={<MyApartments />} />
        <Route path="/student-listings" element={<StudentListings />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/profile/:userId/edit" element={<EditProfile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/apartment/:apartmentId" element={<ApartmentDetail />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:partnerId" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;
