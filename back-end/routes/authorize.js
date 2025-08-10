const express = require('express');
const router = express.Router();
const dataPool = require('../database/db');
const { comparePasswords } = require('../utils/password');
const { body, validationResult } = require('express-validator');

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

router.post('/register', 
  
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('role').isIn(['Student', 'Landlord']).withMessage('Role must be Student or Landlord'),
  ],
  async (req, res) => {
    console.log('Register route hit');
    console.log('Request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phone_number, role } = req.body;

    try {
      const newUser = await dataPool.registerUser(email, password, name, phone_number, role );
      console.log('User registered:', newUser);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
      if (err.message === 'Email already exists') {
        res.status(409).json({ error: err.message });
      } else if (err.message === 'Invalid role') {
        res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
