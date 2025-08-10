import React, { useState, useEffect } from "react";
import { getMyApartments } from "../services/api"; 
import "./MyApartments.css";

function MyApartments() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [apartments, setApartments] = useState([]);

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
    // TODO: call API to publish apartment (send user_id too!)
    const newApartment = { title, address, price };
    console.log("Publishing apartment:", newApartment);
    setTitle("");
    setAddress("");
    setPrice("");
    // Refresh apartments list after publish if needed
  };

  return (
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
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
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
                <p>{apartment.address}</p>
                <p>Price: ${apartment.price}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyApartments;
