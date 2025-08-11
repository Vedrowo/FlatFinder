import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApartmentById } from "../services/api"; 
import "./ApartmentDetail.css";
import { MdMessage } from "react-icons/md";

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

function ApartmentDetail() {
    const role = localStorage.getItem("role")
    const { apartmentId } = useParams();
    const navigate = useNavigate();

    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p>Loading apartment details...</p>;
    if (!apartment) return <p>Apartment not found.</p>;

    const handleLandlordClick = () => {
        navigate(`/profile/${apartment.landlord_user_id}`);
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

                        {role === "student" && (
                            <li><a href="/my-student-listings">My Requests</a></li>
                        )}

                        {role === "landlord" && (
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
            <div className="apartment-detail-container">
                <h2>{apartment.title}</h2>
                <img
                    src={apartment.images?.[0] || "/placeholder.jpg"}
                    alt={apartment.title}
                    className="apartment-detail-image"
                />
                <p><strong>Location:</strong> {apartment.location}</p>
                <p><strong>Price:</strong> ${apartment.price.toLocaleString()}</p>
                <p><strong>Available from:</strong> {new Date(apartment.available_from).toLocaleDateString()}</p>
                <p>
                    <strong>Landlord: </strong>
                    <span
                        onClick={handleLandlordClick}
                        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    >
                        {apartment.landlord_name || "Unknown"}
                    </span>
                </p>
                <p>{apartment.description}</p>
            </div>
        </div>
    );
}

export default ApartmentDetail;
