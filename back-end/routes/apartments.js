const express = require('express')
const apartments = express.Router();
const db = require('../database/db.js')

apartments.get('/', async (req, res, next) => {
    try{
        var queryResult = await db.allApartments();
        res.json(queryResult)
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = apartments