import React, { useEffect, useState } from "react";
import { getApartments } from "../services/api";
import "./Home.css";

function Home() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchApartments() {
      try {
        const data = await getApartments();
        setApartments(data);
      } catch (err) {
        setError("Failed to load apartments.");
      } finally {
        setLoading(false);
      }
    }
    fetchApartments();
  }, []);

  return (
    <div className="startpage-container">
      <h1>Welcome to FlatFinder!</h1>
      <p>Browse available apartments below:</p>

      {loading && <p>Loading apartments...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && apartments.length === 0 && (
        <p>No apartments found. Check back later!</p>
      )}

      <div className="apartment-list">
        {apartments.map((apt) => (
          <div key={apt.id} className="apartment-card">
            <h3>{apt.title || "Untitled Apartment"}</h3>
            <p>{apt.description || "No description provided."}</p>
            <p>
              <strong>Location:</strong> {apt.location || "Unknown"}
            </p>
            <p>
              <strong>Price:</strong> ${apt.price || "N/A"} / month
            </p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
