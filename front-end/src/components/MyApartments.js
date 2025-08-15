import React, { useState, useEffect } from "react";
import { createApartment, getMyApartments } from "../services/api";
import "./MyApartments.css";
import { MdMessage } from "react-icons/md";

function MyApartments() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [images, setImages] = useState([]);
  const [apartments, setApartments] = useState([]);
  const role = localStorage.getItem("role")
  const user_id = localStorage.getItem("user_id")

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

  useEffect(() => {
    async function fetchApartments() {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          console.error("No user_id found");
          return;
        }
        const data = await getMyApartments(user_id);
        setApartments(data);
      } catch (err) {
        console.error("Failed to fetch apartments", err);
      }
    }
    fetchApartments();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", Number(price));
    formData.append("location", location);
    formData.append("available_from", availableFrom);
    formData.append("available_to", availableTo || null);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await createApartment(formData);
      console.log("Publishing apartment");

      setTitle("");
      setDescription("");
      setPrice("");
      setLocation("");
      setAvailableFrom("");
      setAvailableTo("");
      setImages([]);

      const updated = await getMyApartments(user_id);
      setApartments(updated);

    } catch (error) {
      console.error("Failed to publish apartment ", error);
      alert("Failed to publish apartment");
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
              <li><a href="/my-listings">My Listings</a></li>)
            }

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

      <div className="my-apartments-container">
        <div className="publish-apartment">
          <h2>Publish Apartment</h2>
          <form onSubmit={handlePublish}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ marginBottom: "0.5rem" }}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
            <label>
              Available From:
              <input
                type="date"
                value={availableFrom}
                onChange={e => setAvailableFrom(e.target.value)}
                required
              />
            </label>
            <label>
              Available To (optional):
              <input
                type="date"
                value={availableTo}
                onChange={e => setAvailableTo(e.target.value)}
              />
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              multiple
              onChange={e => setImages(e.target.files)}
            />
            <button type="submit">Publish</button>
          </form>
        </div>

        <div className="apartments-list">
          <h2>My Apartments</h2>
          {apartments.length === 0 ? (
            <p>No apartments published yet.</p>
          ) : (
            <ul>
              {apartments.map(apartment => (
                <li key={apartment.id}>
                  <h3>{apartment.title}</h3>
                  <p>{apartment.description}</p>
                  <p>Location: {apartment.location}</p>
                  <p>Price: ${apartment.price}</p>
                  <p>Available From: {apartment.available_from}</p>
                  <p>Available To: {apartment.available_to || "N/A"}</p>
                  {apartment.images && (
                    <div>
                      Images:
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {parseImages(apartment.images).map((imgSrc, idx) => (
                          <img
                            key={idx}
                            src={`http://88.200.63.148:3009${imgSrc}`}
                            alt={`Apartment ${idx + 1}`}
                            style={{ width: '150px', height: 'auto', borderRadius: '4px' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

  );
}

export default MyApartments;