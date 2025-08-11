const express = require('express')
const StudentListings = express.Router();
const db = require('../database/db.js')

StudentListings.get('/', async (req, res, next) => {
    try{
        var queryResult = await db.getStudentListings();
        res.json(queryResult)
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

StudentListings.post('/', async (req, res) => {
  const { user_id, location_preference, price_range, description, move_in_date } = req.body;

  if (!user_id || !location_preference || !price_range || !move_in_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await dataPool.addStudentListing(user_id, location_preference, price_range, description, move_in_date);
    res.status(201).json({ message: "Listing created", request_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



module.exports = StudentListings;