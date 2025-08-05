require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const { hashPassword } = require('../utils/password');
const { comparePasswords } = require('../utils/password')

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

connection.connect((err) => {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    console.log('Connection established!')
})

let dataPool = {}

dataPool.registerUser = async (email, password, name, phoneNum, role, otherData) => {
    const emailExists = await dataPool.checkEmailExists(email)

    if(emailExists){
        throw new Error('Email already exists')
    }

    const encryptedPassword = await hashPassword(password)

    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO User (email , password, name, phone_number) VALUES (?,?,?,?)`, [email, hashPassword, name, phoneNum], (err, res) => {
            if (err) { return reject(err) }

            const userID = res.insertId

            if (role == 'Student') {
                const { major, student_number } = otherData;
                conn.query('INSERT INTO Student (user_id, major, student_number VALUES (?,?,?)', [userID, major, student_number], (err, res) => {
                    if (err) { return reject(err) }
                    return resolve({ user_id: userID, role })
                })
            } 
            else if (role == 'Landlord') {
                const { verified_status, agency_name } = otherData
                conn.query('INSERT INTO Landlord (user_id, verified_status, agency_name', [userID, verified_status, agency_name], (err, res) => {
                    if (err) { return reject(err) }
                    return resolve({ user_id: userID, role })
                })
            }
            else {
                return reject(new Error("Invalid role"))
            }
        })
    })
}

dataPool.loginUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT FROM User WHERE email = ?', [email], async (err, res) => {
            if(err) { return reject(err) }
            if(res.length == 0){
                return reject(new Error('User not registered'))
            }

            const user = res[0]

            const pwMatch = await comparePasswords(password, user.password)
            if(!pwMatch){
                return reject(new Error('Invalid password'))
            }

            return resolve(user)
        })
    })
}

dataPool.checkEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM User WHERE email = ?`, [email], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) {
        return resolve(true);  
      }
      return resolve(false);
    });
  });
};

dataPool.allApartments = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Apartment', (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
};

module.exports = dataPool;