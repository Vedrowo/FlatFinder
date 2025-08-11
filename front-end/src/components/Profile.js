import React, { useState, useEffect } from "react";

const BACKEND_URL = "http://88.200.63.148:3009"; // adjust your backend URL

export default function Profile({ profileUserId: propProfileUserId }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const storedUserId = localStorage.getItem("user_id");

  // use passed profileUserId or fallback to logged-in user ID
  const profileUserId = propProfileUserId || currentUser.user_id || storedUserId;

  const [profileUser, setProfileUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileUserId) {
      setError("No user ID available");
      setLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/api/users/${profileUserId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => setProfileUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileUserId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-logo">FlatFinder</div>

        <div className="navbar-links">
          <ul className="navbar-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/apartments">Apartments</a></li>
            <li><a href="/student-listings">Student Listings</a></li>
            <li><a href="/messages">Messages</a></li>
          </ul>
        </div>

        <div className="navbar-dropdown">
          <button className="dropdown-btn">Account ▾</button>
          <div className="dropdown-content">
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
            {/* Add logout if you want here */}
          </div>
        </div>
      </nav>

      <div className="profile-container" style={{ maxWidth: 600, margin: "20px auto" }}>
        <h2>User Profile</h2>

        {profileUser ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {Object.entries(profileUser).map(([key, value]) => (
                <tr key={key} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "8px", fontWeight: "bold", textTransform: "capitalize" }}>
                    {key.replace(/_/g, " ")}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No profile data found.</p>
        )}
      </div>
    </div>
  );
}
