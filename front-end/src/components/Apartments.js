import React, { useEffect, useState } from "react";
import { getApartments } from "../services/api";
import { useNavigate } from "react-router-dom";
import { MdMessage } from "react-icons/md";
import "./Apartments.css";

function parseImages(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images;

  try {
    return JSON.parse(images);
  } catch {
    return [images];
  }
}

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    getApartments().then(data => setApartments(data));
  }, []);

  return (
    <div className="all-apartments-container">
      <nav className="navbar">
        <div className="navbar-logo">FlatFinder</div>

        <div className="navbar-links">
          <ul className="navbar-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/apartments">Apartments</a></li>
            <li><a href="/student-listings">Student Listings</a></li>

            {role === "Student" && (
              <li><a href="/my-student-listings">My Requests</a></li>
            )}

            {role === "Landlord" && (
              <>
                <li><a href="/my-apartments">My Apartments</a></li>
              </>
            )}

            <li><a href="/messages">
              <MdMessage style={{ marginRight: "5px", verticalAlign: "middle" }} />
              Messages
            </a></li>
          </ul>
        </div>

        <div className="navbar-search">
          <input type="text" placeholder="Search..." className="navbar-search" />
        </div>

        <div className="navbar-dropdown">
          <button className="dropdown-btn">Account ▾</button>
          <div className="dropdown-content">
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px',
                margin: 0,
                color: '#004aad',
                cursor: 'pointer',
                font: 'inherit',
                textDecoration: 'underline'
              }}
            >
              Logout
            </button>

          </div>
        </div>
      </nav>
      <div className="all-available-apartments">
        <h2>Available Apartments</h2>
        {apartments.length === 0 && <p>No apartments found.</p>}
        <div className="all-apartments-list">
          {apartments.map(apartment => {
            const parsedImages = parseImages(apartment.images);
            const mainImage = parsedImages.length > 0
              ? `http://88.200.63.148:3009${parsedImages[0]}`
              : "/placeholder.jpg";

            const availableFromDate = new Date(apartment.available_from);
            const availableFromFormatted = availableFromDate.toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            });


            return (
              <div
                key={apartment.apartment_id}
                className="apartment-card"
                onClick={() => navigate(`/apartment/${apartment.apartment_id}`)}
                tabIndex={0}
                role="button"
                onKeyPress={e => { if (e.key === 'Enter') navigate(`/apartment/${apartment.apartment_id}`) }}
              >
                <img
                  src={mainImage}
                  alt={apartment.title}
                  className="apartment-image"
                />
                <div className="apartment-info">
                  <h3>{apartment.title}</h3>
                  <p className="apartment-location">{apartment.location}</p>
                  <p className="apartment-price">Price: ${apartment.price.toLocaleString()}</p>
                  <p className="apartment-available">Available from: {availableFromFormatted}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Apartments;
