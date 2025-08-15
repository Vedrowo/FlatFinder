import React, { useEffect, useState, useCallback } from "react";
import { getMyListings, createListing } from "../services/api";
import { MdMessage } from "react-icons/md";
import "./MyListings.css"

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

function MyListings() {
    const user_id = localStorage.getItem("user_id");
    const role = localStorage.getItem("role")
    const [listings, setListings] = useState([]);
    const [formData, setFormData] = useState({
        location_preference: "",
        price_range: "",
        description: "",
        move_in_date: "",
    });
    const [loading, setLoading] = useState(false);

    const fetchMyListings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyListings(user_id);
            setListings(data);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, [user_id]);

    useEffect(() => {
        fetchMyListings();
    }, [fetchMyListings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.location_preference || !formData.price_range || !formData.move_in_date) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            await createListing({ user_id, ...formData });
            alert("Listing created!");
            setFormData({
                location_preference: "",
                price_range: "",
                description: "",
                move_in_date: "",
            });
            fetchMyListings();
        } catch (err) {
            alert("Failed to create listing.");
        }
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
                            <li><a href="/my-listings">My Listings</a></li>
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
            <div className="my-listings-container">
                <h2>My Student Listings</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : listings.length === 0 ? (
                    <p>You have no listings yet.</p>
                ) : (
                    <ul>
                        {listings.map(listing => (
                            <li key={listing.request_id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
                                <strong>Location:</strong> {listing.location_preference} <br />
                                <strong>Price Range:</strong> ${listing.price_range} <br />
                                <strong>Move-in Date:</strong> {new Date(listing.move_in_date).toLocaleDateString()} <br />
                                <strong>Description:</strong> {listing.description}
                            </li>
                        ))}
                    </ul>
                )}

                <h3>Add New Listing</h3>
                <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
                    <input
                        type="text"
                        name="location_preference"
                        placeholder="Location preference"
                        value={formData.location_preference}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                    />
                    <input
                        type="text"
                        name="price_range"
                        placeholder="Price range"
                        value={formData.price_range}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                    />
                    <input
                        type="date"
                        name="move_in_date"
                        value={formData.move_in_date}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                    />
                    <textarea
                        name="description"
                        placeholder="Description (optional)"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", resize: "vertical" }}
                    />
                    <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>Add Listing</button>
                </form>
            </div>
        </div>

    );
}

export default MyListings;
