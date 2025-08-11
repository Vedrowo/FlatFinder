const express = require('express')
const myListings = express.Router();
const db = require('../database/db.js')

myListings.get('/', async (req, res, next) => {
  try {
    const user_id = req.query.user_id;  
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const queryResult = await db.getStudentListingsForUser(user_id);
    res.json(queryResult);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = myListings;