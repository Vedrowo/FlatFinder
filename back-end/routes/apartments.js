const express = require('express');
const apartments = express.Router();
const db = require('../database/db.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

apartments.get('/', async (req, res, next) => {
  try {
    var queryResult = await db.getApartments();
    res.json(queryResult);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

apartments.post('/', upload.array('images'), async (req, res, next) => {
  try {
    const {
      user_id,
      title,
      description,
      price,
      location,
      available_from,
      available_to
    } = req.body;

    if (!user_id || !title || !price || !location || !available_from) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const imagesJson = JSON.stringify(imagePaths);

    const result = await db.addApartment(
      user_id,
      title,
      description,
      price,
      location,
      available_from,
      available_to,
      imagesJson
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

module.exports = apartments;
