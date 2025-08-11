const express = require('express')
const myApartments = express.Router();
const db = require('../database/db.js')

myApartments.get('/', async (req, res, next) => {
  try {
    const user_id = req.query.user_id;  
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const queryResult = await db.getApartmentsFromLandlord(user_id);
    res.json(queryResult);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = myApartments;