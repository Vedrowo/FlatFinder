const express = require('express');
const router = express.Router();
const dataPool = require('../database/db');
const { comparePasswords } = require('../utils/password');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await dataPool.loginUser(email, password);
    req.session.user = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
