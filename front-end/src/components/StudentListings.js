import React, { useEffect, useState } from "react";
import { getStudentListings } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import {MdMessage } from "react-icons/md";
import "./StudentListings.css";

function StudentListings() {
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        getStudentListings().then(data => setListings(data));
    }, []);

    return (
        <div className="whole-container">
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

            <div className="student-listings-container">
                <h2>Student Apartment Requests</h2>
                {listings.length === 0 && <p>No student requests found.</p>}
                <div className="student-listings-list">
                    {listings.map(listing => {
                        const moveInDate = new Date(listing.move_in_date);
                        const formattedMoveIn = moveInDate.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        });

                        return (
                            <div
                                key={listing.request_id}
                                className="listing-card"
                                onClick={() => navigate(`/student-request/${listing.request_id}`)}
                                tabIndex={0}
                                role="button"
                                onKeyPress={e => {
                                    if (e.key === "Enter")
                                        navigate(`/student-request/${listing.request_id}`);
                                }}
                            >
                                <h3>Location: {listing.location_preference}</h3>
                                <p>Price Range: {listing.price_range}</p>
                                <p>Move-in Date: {formattedMoveIn}</p>
                                <p className="listing-description">{listing.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default StudentListings;
