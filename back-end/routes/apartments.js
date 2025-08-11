const express = require('express')
const apartments = express.Router();
const db = require('../database/db.js')

apartments.get('/', async (req, res, next) => {
    try{
        var queryResult = await db.getApartments();
        res.json(queryResult)
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

apartments.post('/', async (req, res, next) => {
  try {
    const {
      user_id,
      title,
      description,
      price,
      location,
      available_from,
      available_to,
      images
    } = req.body;

    if (!user_id || !title || !price || !location || !available_from) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.addApartment(
      user_id,
      title,
      description,
      price,
      location,
      available_from,
      available_to,
      images 
    );

    res.status(201).json({ message: "Apartment created", apartment_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

apartments.get('/:apartment_id', async (req, res, next) => {
  const apartmentId = req.params.apartment_id;
  try {
    const apartment = await db.getApartment(apartmentId);

    if (!apartment) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    res.json(apartment);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


module.exports = apartments