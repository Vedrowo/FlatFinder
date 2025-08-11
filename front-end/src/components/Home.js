import React from "react";
import "./Home.css";
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

function Home() {
  const role = localStorage.getItem("role")
  const user = localStorage.getItem("user_id")
  console.log("Role returned from server:", role);
  console.log("User returned from server: ", user)

  return (
    <div className="home-container">
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

      <section className="home-grid">
        <div className="grid-item welcome-box">
          <h1>Welcome to FlatFinder</h1>
          <p>Browse apartments, connect with students, and manage your listings easily.</p>
          <button className="browse-button" onClick={() => window.location.href = "/apartments"}>
            Browse
          </button>
        </div>
        <div className="grid-item small-image">
          <img src="/pic1.jpg" alt="Apartment" />
        </div>
        <div className="grid-item small-image">
          <img src="/pic2.jpg" alt="City" />
        </div>
        <div className="grid-item large-image">
          <img src="/pic3.jpg" alt="Home" />
        </div>
      </section>
    </div>
  );
}

export default Home;
