import React, { useState, useEffect } from "react";
import "./Profile.css";

function Profile({ profileUserId }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state for editing fields
  const [bio, setBio] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [major, setMajor] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const isOwnProfile = currentUser?.user_id === profileUserId;

  useEffect(() => {
    if (!profileUserId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/users/${profileUserId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setProfileUser(data);
        setBio(data.bio || "");
        setAgencyName(data.agency_name || "");
        setMajor(data.major || "");
        setStudentNumber(data.student_number || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [profileUserId]);

  const handleSave = () => {
    if (!profileUser) return;
    if (!isOwnProfile) return;

    const updatedData = {
      bio,
      ...(profileUser.role === "landlord" && { agency_name: agencyName }),
      ...(profileUser.role === "student" && { major, student_number: studentNumber }),
    };

    fetch(`/api/users/${profileUser.user_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save profile");
        return res.json();
      })
      .then((updatedUser) => {
        setProfileUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        alert("Profile saved!");
      })
      .catch((err) => {
        alert("Error saving profile: " + err.message);
      });
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profileUser) return <p>No profile found.</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-username">{profileUser.username}</h2>

      <div className="profile-section">
        <label>Bio:</label>
        {isOwnProfile ? (
          <textarea
            className="profile-textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="profile-text">{profileUser.bio || "No bio added yet."}</p>
        )}
      </div>

      {profileUser.role === "landlord" && (
        <>
          <div className="profile-section">
            <label>Verified Status:</label>
            <p className="profile-text">{profileUser.verified_status ? "Verified" : "Not Verified"}</p>
          </div>

          <div className="profile-section">
            <label>Agency Name:</label>
            {isOwnProfile ? (
              <input
                className="profile-input"
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Your agency name"
              />
            ) : (
              <p className="profile-text">{profileUser.agency_name || "No agency name provided."}</p>
            )}
          </div>
        </>
      )}

      {profileUser.role === "student" && (
        <>
          <div className="profile-section">
            <label>Major:</label>
            {isOwnProfile ? (
              <input
                className="profile-input"
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Your major"
              />
            ) : (
              <p className="profile-text">{profileUser.major || "No major provided."}</p>
            )}
          </div>

          <div className="profile-section">
            <label>Student Number:</label>
            {isOwnProfile ? (
              <input
                className="profile-input"
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="Your student number"
              />
            ) : (
              <p className="profile-text">{profileUser.student_number || "No student number provided."}</p>
            )}
          </div>
        </>
      )}

      {isOwnProfile && (
        <button className="profile-save-btn" onClick={handleSave}>
          Save Changes
        </button>
      )}
    </div>
  );
}

export default Profile;