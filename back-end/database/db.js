require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const { hashPassword } = require('../utils/password');
const { comparePasswords } = require('../utils/password');
const { resolve } = require('path');

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

let dataPool = {}

dataPool.registerUser = async (email, password, name, phone_number, role) => {
    const emailExists = await dataPool.checkEmailExists(email)

    if (emailExists) {
        throw new Error('Email already exists')
    }

    const encryptedPassword = await hashPassword(password)

    const profile_picture = '/uploads/default-profile.jpg';

    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO User (email , password, name, phone_number, profile_picture) VALUES (?,?,?,?,?)`, [email, encryptedPassword, name, phone_number, profile_picture], (err, res) => {
            if (err) { return reject(err) }

            const userID = res.insertId

            if (role == 'Student') {
                conn.query('INSERT INTO Student (user_id) VALUES (?)', [userID], (err, res) => {
                    if (err) { return reject(err) }
                    return resolve({
                        user_id: userID,
                        role,
                        name,
                        email
                    })
                })
            }
            else if (role == 'Landlord') {
                conn.query('INSERT INTO Landlord (user_id) VALUES (?)', [userID], (err, res) => {
                    if (err) { return reject(err) }
                    return resolve({
                        user_id: userID,
                        role,
                        name,
                        email
                    })
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

            conn.query('SELECT * FROM Landlord WHERE user_id = ?', [user.user_id], (err, landlordRes) => {
                if (err) return reject(err);

                if (landlordRes.length > 0) {
                    user.role = "Landlord";
                    return resolve(user);
                }

                conn.query('SELECT * FROM Student WHERE user_id = ?', [user.user_id], (err, studentRes) => {
                    if (err) return reject(err);

                    if (studentRes.length > 0) {
                        user.role = "Student";
                    } else {
                        user.role = null;
                    }
                    return resolve(user);
                })
            })
        })
    })
}

dataPool.getUser = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User WHERE user_id = ?', [user_id], (err, res) => {
            if (err) return reject(err);

            if (!res || res.length === 0) {
                return resolve(null);
            }

            const user = res[0];

            conn.query('SELECT * FROM Landlord WHERE user_id = ?', [user.user_id], (err, landlordRes) => {
                if (err) return reject(err);

                if (landlordRes.length > 0) {
                    user.role = "Landlord";
                    user.agency_name = landlordRes[0].agency_name;
                    user.verified_status = landlordRes[0].verified_status;
                    return resolve(user);
                }

                conn.query('SELECT * FROM Student WHERE user_id = ?', [user.user_id], (err, studentRes) => {
                    if (err) return reject(err);

                    if (studentRes.length > 0) {
                        user.role = "Student";
                        user.major = studentRes[0].major;
                        user.student_number = studentRes[0].student_number;
                    } else {
                        user.role = "Unknown";
                    }
                    resolve(user);
                });
            });
        });
    });
};


dataPool.updateUserProfile = (user_id, data) => {
    return new Promise((resolve, reject) => {
        let userQuery = "UPDATE User SET bio=?";
        const userParams = [data.bio];

        if (data.profile_picture) {
            userQuery += ", profile_picture=?";
            userParams.push(data.profile_picture);
        }

        userQuery += " WHERE user_id=?";
        userParams.push(user_id);

        conn.query(userQuery, userParams, (err) => {
            if (err) return reject(err);

            if (data.role === "Student") {
                const studentQuery = `
                    UPDATE Student 
                    SET student_number=?, major=? 
                    WHERE user_id=?`;
                const studentParams = [data.student_number, data.major, user_id];

                conn.query(studentQuery, studentParams, (err) => {
                    if (err) return reject(err);
                    resolve({ message: "Student profile updated" });
                });

            } else if (data.role === "Landlord") {
                const landlordQuery = `
                    UPDATE Landlord 
                    SET agency_name=?, verified_status=? 
                    WHERE user_id=?`;
                const landlordParams = [data.agency_name, data.verified_status, user_id];

                conn.query(landlordQuery, landlordParams, (err) => {
                    if (err) return reject(err);
                    resolve({ message: "Landlord profile updated" });
                });

            } else {
                resolve({ message: "User profile updated" });
            }
        });
    });
};

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
        conn.query('UPDATE User SET bio = ? WHERE user_id = ?', [bio, user_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.addApartment = (user_id, title, description, price, location, from, to, images) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'INSERT INTO Apartment (user_id, title, description, price, location, available_from, available_to, images) VALUES (?,?,?,?,?,?,?,?)',
            [user_id, title, description, price, location, from, to, images],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            }
        )
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

dataPool.getApartmentsFromLandlord = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Apartment WHERE user_id = ?', [user_id], (err, res) => {
            if (err) { return reject(err) }

            const parsed = res.map(apartment => {
                return {
                    ...apartment,
                    images: apartment.images ? JSON.parse(apartment.images) : []
                };
            });

            return resolve(parsed)
        })
    })
}

dataPool.getApartments = (startPrice, endPrice, location) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM Apartment WHERE 1=1'
        const params = []

        if (startPrice !== undefined) {
            sql += ' AND price >= ?'
            params.push(startPrice)
        }

        if (endPrice !== undefined) {
            sql += ' AND price <= ?'
            params.push(endPrice)
        }

        if (location) {
            sql += ' AND LOWER(location) LIKE LOWER(?)'
            params.push(`%${location}%`)
        }

        conn.query(sql, params, (err, res) => {
            if (err) return reject(err)
            const parsed = res.map(apartment => {
                return {
                    ...apartment,
                    images: apartment.images ? JSON.parse(apartment.images) : []
                };
            });

            return resolve(parsed)
        })
    })
}

dataPool.getApartmentOwner = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT name FROM User WHERE (user_id) = ?', [user_id], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res[0].name)
        })
    })
}

dataPool.getApartment = (apartment_id) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT a.*, u.user_id AS landlord_id, u.name AS landlord_name
      FROM Apartment a
      JOIN User u ON a.user_id = u.user_id
      WHERE a.apartment_id = ?
    `;

        conn.query(query, [apartment_id], (err, res) => {
            if (err) return reject(err);
            if (res.length === 0) return resolve(null);

            const row = res[0];
            const apartment = {
                apartment_id: row.apartment_id,
                user_id: row.user_id,
                title: row.title,
                description: row.description,
                price: row.price,
                location: row.location,
                available_from: row.available_from,
                available_to: row.available_to,
                images: row.images ? JSON.parse(row.images) : [],
                landlord: {
                    user_id: row.landlord_id,
                    username: row.landlord_name,
                }
            };

            resolve(apartment);
        });
    });
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

dataPool.getStudentListingsForUser = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM StudentListing WHERE user_id = ?', [user_id], (err, res) => {
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
        conn.query(
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
        conn.query('SELECT * FROM Message WHERE (sender_id = ? AND receiver_id = ?) OR (receiver_id = ? AND sender_id = ?) ORDER BY timestamp ASC',
            [sender_id, receiver_id, sender_id, receiver_id], (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            }
        )
    })
}

dataPool.getRecentChats = (user_id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT 
                u.user_id AS partner_id,
                u.name AS partner_name,
                u.profile_picture AS partner_picture,
                m1.content AS last_message,
                m1.timestamp AS last_time
            FROM Message m1
            INNER JOIN (
                SELECT 
                    IF(sender_id = ?, receiver_id, sender_id) AS chat_partner,
                    MAX(timestamp) AS last_time
                FROM Message
                WHERE sender_id = ? OR receiver_id = ?
                GROUP BY chat_partner
            ) m2 ON ((m1.sender_id = ? AND m1.receiver_id = m2.chat_partner) 
                     OR (m1.sender_id = m2.chat_partner AND m1.receiver_id = ?))
                 AND m1.timestamp = m2.last_time
            INNER JOIN User u ON u.user_id = m2.chat_partner
            ORDER BY m1.timestamp DESC`,
            [user_id, user_id, user_id, user_id, user_id],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};


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