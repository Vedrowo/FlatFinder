import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApartmentById } from "../services/api";
import { getLandlordName } from "../services/api";
import "./ApartmentDetail.css";
import { MdMessage } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

const handleLogout = async () => {
  try {
    const res = await fetch('http://88.200.63.148:3009/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      window.location.href = '/';
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

function parseImages(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images;

  try {
    return JSON.parse(images);
  } catch {
    return [images];
  }
}

function ApartmentDetail() {
  const role = localStorage.getItem("role");
  const user_id = localStorage.getItem("user_id")
  const { apartmentId } = useParams();
  const navigate = useNavigate();

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [landlordName, setLandlordName] = useState("");

  useEffect(() => {
    getApartmentById(apartmentId)
      .then(data => {
        setApartment(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [apartmentId]);

  useEffect(() => {
  if (apartment?.user_id) {
    getLandlordName(apartment.user_id)
      .then(name => setLandlordName(name))
      .catch(err => console.error(err));
  }
}, [apartment?.user_id]);

  if (loading) return <p>Loading apartment details...</p>;
  if (!apartment) return <p>Apartment not found.</p>;

  const images = parseImages(apartment.images);
  const mainImage = images.length > 0
    ? `${API_URL}${images[currentImageIndex]}`
    : "/placeholder.jpg";

  const handleLandlordClick = () => {
    console.log("Apartment user_id:", apartment.user_id);
    navigate(`/profile/${apartment.user_id}`);
  };

  return (
    <div className="container">
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
            <a href={`/profile/${user_id}`}>Profile</a>
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

      <div className="apartment-detail-container">
        <h2>{apartment.title}</h2>

        <div className="image-gallery">
          <img
            src={mainImage}
            alt={`${apartment.title} - ${currentImageIndex + 1}`}
            className="apartment-detail-image"
          />

          {images.length > 1 && (
            <>
              <button
                className="slideshow-button prev"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
              >
                ‹
              </button>
              <button
                className="slideshow-button next"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
              >
                ›
              </button>
            </>
          )}
        </div>


        <p><strong>Location:</strong> {apartment.location}</p>
        <p><strong>Price:</strong> ${apartment.price.toLocaleString()}</p>
        <p><strong>Available from:</strong> {new Date(apartment.available_from).toLocaleDateString()}</p>
        <p>
          <strong>Landlord: </strong>
          <span
            onClick={handleLandlordClick}
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            {landlordName || "Loading..."}
          </span>
        </p>
        <p>{apartment.description}</p>
        <button className="application-button"
          onClick={async () => {
            try {
              const res = await fetch(`http://88.200.63.148:3009/application-request`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user_id, apartment_id: apartment.id }),
              });

              if (res.ok) {
                alert("Application request sent!");
              } else {
                alert("Failed to send application request.");
              }
            } catch (err) {
              alert("Error sending application request.");
              console.error(err);
            }
          }}
        >
          Apply for this Apartment
        </button>

      </div>
    </div>
  );
}

export default ApartmentDetail;
