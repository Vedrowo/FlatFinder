const express = require('express')
const applicationRequest = express.Router();
const db = require('../database/db.js')

applicationRequest.post('/', async (req, res, next) => {
  try {
    const {user_id, apartment_id} = req.body;  
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const queryResult = await db.sendApplicationRequest(user_id, apartment_id);
    res.json(queryResult);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = applicationRequest;