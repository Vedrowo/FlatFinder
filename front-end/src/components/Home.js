import React from "react";
import "./Home.css";

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
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-logo">FlatFinder</div>
        <ul className="navbar-links">
          <li><a href="/apartments">Apartments</a></li>
          <li><a href="/student-listings">Student Listings</a></li>
          <li><a href="/messages">Messages</a></li>
        </ul>
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

      <main className="home-main">
        <h1>Welcome to FlatFinder</h1>
        <p>Browse apartments, connect with students, and manage your listings easily.</p>
      </main>
    </div>
  );
}

export default Home;
