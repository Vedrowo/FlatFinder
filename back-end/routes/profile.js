const express = require('express');
const Profile = express.Router();
const db = require('../database/db.js');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile-pics'));
  },
  filename: (req, file, cb) => {
    cb(null, `user-${req.params.userId}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

Profile.get('/:userId', async (req, res) => {
  try {
    const user_id = req.params.userId;
    console.log("Fetching user:", user_id);

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const user = await db.getUser(user_id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const defaultPic = '/uploads/default-profile.jpg';

    const profileData = {
      id: user.user_id,
      name: user.name,
      email: user.email, 
      bio: user.bio || "This user hasn't added a bio yet.",
      profile_picture: user.profile_picture || '/uploads/default-profile.jpg',
      role: user.role,
      phone_number: user.phone_number,
      student_number: user.student_number || null,
      major: user.major || null,
      company_name: user.company_name || null,
      verified: user.verified || false
    };


    res.json(profileData);
  } catch (err) {
    console.error("Error in /profile/:userId", err);
    res.sendStatus(500);
  }
});

Profile.post('/:userId/edit', upload.single('profile_picture'), async (req, res) => {
  try {
    const user_id = req.params.userId;
    const { bio, role, student_number, major, company_name, verified } = req.body;

    let profilePicPath = null;
    if (req.file) {
      profilePicPath = `/uploads/profile-pics/${req.file.filename}`;
    }

    const updateData = { bio, role, student_number, major, company_name, verified };

    if (req.file) {
      updateData.profile_picture = `/uploads/profile-pics/${req.file.filename}`;
    }

    await db.updateUserProfile(user_id, updateData);

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error in /profile/:userId/edit", err);
    res.sendStatus(500);
  }
});

module.exports = Profile;
