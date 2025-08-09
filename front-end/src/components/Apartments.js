import React, { useEffect, useState } from "react";
import { getApartments } from "../services/api";

function Apartments() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    getApartments().then(data => setApartments(data));
  }, []);

  return (
    <div>
      <h2>Available Apartments</h2>
      {apartments.length === 0 && <p>No apartments found.</p>}
      {apartments.map(apartment => (
        <div key={apartment.apartment_id}>
          <h3>{apartment.title}</h3>
          <p>{apartment.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Apartments;
