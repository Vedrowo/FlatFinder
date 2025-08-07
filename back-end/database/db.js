require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const { hashPassword } = require('../utils/password');
const { comparePasswords } = require('../utils/password');
const { resolve } = require('path');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

conn.connect((err) => {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    console.log('Connection established!')
})

let dataPool = {}

dataPool.registerUser = async (email, password, name, phoneNum, role, otherData) => {
    const emailExists = await dataPool.checkEmailExists(email)

    if (emailExists) {
        throw new Error('Email already exists')
    }

    const encryptedPassword = await hashPassword(password)

    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO User (email , password, name, phone_number) VALUES (?,?,?,?)`, [email, encryptedPassword, name, phoneNum], (err, res) => {
            if (err) { return reject(err) }

            const userID = res.insertId

            if (role == 'Student') {
                const { major, student_number } = otherData;
                conn.query('INSERT INTO Student (user_id, major, student_number) VALUES (?,?,?)', [userID, major, student_number], (err, res) => {
                    if (err) { return reject(err) }
                    return resolve({ user_id: userID, role })
                })
            }
            else if (role == 'Landlord') {
                const { verified_status, agency_name } = otherData
                conn.query('INSERT INTO Landlord (user_id, verified_status, agency_name) VALUES (?,?,?)', [userID, verified_status, agency_name], (err, res) => {
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
        conn.query('SELECT * FROM User WHERE email = ?', [email], async (err, res) => {
            if (err) { return reject(err) }
            if (res.length == 0) {
                return reject(new Error('User not registered'))
            }

            const user = res[0]

            const pwMatch = await comparePasswords(password, user.password)
            if (!pwMatch) {
                return reject(new Error('Invalid password'))
            }

            return resolve(user)
        })
    })
}

dataPool.deleteUser = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM User WHERE user_id = ?', [user_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.checkEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM User WHERE email = ?`, [email], (err, results) => {
            if (err) { return reject(err) }
            if (results.length > 0) {
                return resolve(true);
            }
            return resolve(false);
        });
    });
};

dataPool.setBio = (user_id, bio) => {
    return new Promise((resolve, reject) => {
        conn.query('UPDATE User SET bio = ? WHERE user_id = ?', [user_id, bio], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.addApartment = (user_id, title, description, price, location, from, to, images) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Apartment (user_id, title, description, price, location, available_from, available_to, images) VALUES (?,?,?,?,?,?,?,?)', [user_id, title, description, price, location, from, to, images], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.removeApartment = (apartment_id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Apartment WHERE apartment_id = ?', [apartment_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getApartment = (apartment_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Apartment WHERE apartment_id = ?', [apartment_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getApartmentsFromLandlord = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Apartment WHERE user_id = ?', [user_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getApartmentsWithinPriceRange = (startPrice, endPrice) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Apartment WHERE price BETWEEN ? AND ?', [startPrice, endPrice], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.allApartments = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Apartment', (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
};

dataPool.addStudentListing = (user_id, location_preference, price_range, description, move_in_date) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO StudentListing (user_id, location_preference, price_range, description, move_in_date) VALUES (?,?,?,?,?)', [user_id, location_preference, price_range, description, move_in_date], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.removeStudentListing = (request_id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM StudentListing WHERE request_id = ?', [request_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getStudentListings = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM StudentListing', (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.sendApplicationRequest = (user_id, apartment_id) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO ApplicationRequest (user_id, apartment_id) VALUES (?,?)', [user_id, apartment_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getApplicationRequestsByLandlord = (landlordId) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT ar.application_id, ar.apartment_id, ar.user_id AS student_id,
        a.title AS apartment_title, a.location, a.price,
        u.name AS student_name, u.email AS student_email,
        ar.date_applied
       FROM 
         ApplicationRequest ar
       JOIN 
         Apartment a ON ar.apartment_id = a.apartment_id
       JOIN 
         User u ON ar.user_id = u.user_id
       WHERE 
         a.user_id = ?
       ORDER BY 
         ar.date_applied DESC`,
            [landlordId],
            (err, results) => {
                if (err) return reject(err)
                return resolve(results)
            }
        )
    })
}


dataPool.sendMessage = (sender_id, receiver_id, content) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Message (sender_id, receiver_id, content) VALUES (?,?,?)', [sender_id, receiver_id, content], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getChat = (sender_id, receiver_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT content FROM Message WHERE (sender_id = ? AND receiver_id = ?) OR (receiver_id = ? AND sender_id = ?) ORDER BY timestamp ASC',
            [sender_id, receiver_id, sender_id, receiver_id], (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            }
        )
    })
}

dataPool.giveRating = (reviewer_id, reviewed_id, rating, comment) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Review (reviewer_id, reviewed_id, rating, comment) VALUES (?,?,?,?)', [reviewer_id, reviewed_id, rating, comment], async (err, res) => {
            if (err) { return reject(err) }
            try {
                const avgRating = await dataPool.getAvgRating(reviewed_id)
                conn.query('UPDATE User SET rating = ? WHERE user_id = ?', [avgRating, reviewed_id], (err) => {
                    if (err) { return reject(err) }
                    resolve({ message: 'Review submitted and average rating updated' })
                })
            }
            catch (error) {
                return reject(error)
            }
        })
    })
}

dataPool.getAvgRating = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT AVG(rating) AS avg_rating FROM Review WHERE reviewed_id = ?', [user_id], (err, res) => {
            if (err) { return reject(err) }
            const avg = res[0].avg_rating || 0;
            return resolve(avg);
        })
    })
}

module.exports = dataPool;