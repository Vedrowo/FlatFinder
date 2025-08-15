import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdMessage } from "react-icons/md";

import "./Profile.css";

const API_URL = process.env.REACT_APP_API_URL;

const handleLogout = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
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

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const loggedInUserId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role")


  useEffect(() => {
    fetch(`${API_URL}/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched user:", data);
        setUser(data);
      })
      .catch(err => console.error(err));
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  const isOwnProfile = String(loggedInUserId) === String(user.id);
  const profilePic = user.profile_picture
    ? `${API_URL}${user.profile_picture}`
    : `${API_URL}/uploads/default-profile.jpg`;
  console.log("Profile pic: ", profilePic);

  return (
    <div>
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
            <a href={`/profile/${loggedInUserId}`}>Profile</a>
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
      <div className="profile-page-container">
        <div className="profile-page-grid">
          <div className="profile-card" style={{ textAlign: "center" }}>
            <div className="profile-image-wrapper" style={{ margin: "0 auto", width: "150px", height: "150px" }}>
              <img
                src={profilePic}
                alt="Profile"
                className="profile-image"
              />
            </div>
            <h1 className="profile-name" style={{ marginTop: "1rem" }}>{user.name}</h1>
            <p><strong>Bio:</strong> {user.bio || "No bio yet"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Phone number:</strong> {user.phone_number}</p>

            {user.role === "Student" && (
              <>
                <p><strong>Student Number:</strong> {user.student_number || "N/A"}</p>
                <p><strong>Major:</strong> {user.major || "N/A"}</p>
              </>
            )}

            {user.role === "Landlord" && (
              <>
                <p><strong>Agency Name:</strong> {user.agency_name || "N/A"}</p>
                <p><strong>Verified:</strong> {user.verified_status ? "Yes ✅" : "No ❌"}</p>
              </>
            )}

            {isOwnProfile && (
              <button
                className="profile-edit-button"
                onClick={() => navigate(`/profile/${userId}/edit`)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}

export default Profile;
