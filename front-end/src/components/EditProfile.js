import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/profile/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", user.bio || "");
    formData.append("role", user.role);

    if (user.role === "Student") {
      formData.append("student_number", user.student_number || "");
      formData.append("major", user.major || "");
    } else if (user.role === "Landlord") {
      formData.append("company_name", user.company_name || "");
      formData.append("verified", user.verified ? 1 : 0);
    }

    if (selectedFile) {
      formData.append("profile_picture", selectedFile);
    }

    await fetch(`${API_URL}/profile/${userId}/edit`, {
      method: "POST",
      body: formData
    });

    navigate(`/profile/${userId}`);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page-container">
      <div className="profile-page-grid">
        <div className="profile-card">
          <h2 className="profile-name">Edit Profile</h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="profile-form"
          >
            <div className="profile-form-group">
              <label>Bio:</label>
              <textarea
                name="bio"
                value={user.bio || ""}
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <div className="profile-form-group">
              <label>Change Profile Picture:</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="profile-input"
              />
            </div>

            {user.role === "Student" && (
              <>
                <div className="profile-form-group">
                  <label>Student Number:</label>
                  <input
                    type="text"
                    name="student_number"
                    value={user.student_number || ""}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label>Major:</label>
                  <input
                    type="text"
                    name="major"
                    value={user.major || ""}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </div>
              </>
            )}

            {user.role === "Landlord" && (
              <>
                <div className="profile-form-group">
                  <label>Company Name:</label>
                  <input
                    type="text"
                    name="company_name"
                    value={user.company_name || ""}
                    onChange={handleChange}
                    className="profile-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="verified"
                      checked={!!user.verified}
                      onChange={(e) =>
                        setUser({ ...user, verified: e.target.checked })
                      }
                    />
                    Verified
                  </label>
                </div>
              </>
            )}

            <button type="submit" className="profile-edit-button">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
