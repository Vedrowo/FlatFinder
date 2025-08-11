import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Apartments from "./components/Apartments";
import MyApartments from "./components/MyApartments"
import Home from "./components/Home"
import StartPage from "./components/StartPage"
import StudentListings from "./components/StudentListings";
import MyListings from "./components/MyListings";
import Profile from "./components/Profile";
import ApartmentDetail from './components/ApartmentDetail';

function ProfileWrapper() {
  const { userId } = useParams();
  return <Profile profileUserId={userId} />;
}

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<ProfileWrapper />} />
        <Route path="/apartment/:apartmentId" element={<ApartmentDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
