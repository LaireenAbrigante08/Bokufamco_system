const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async createUser(fullname, username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 8);
        
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (fullname, username, email, password) VALUES (?, ?, ?, ?)', 
                [fullname, username, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error("User Model - Database error on insert:", err);
                        return reject(err);
                    }
                    console.log("User Model - Insert successful:", result);

                    // Double-check if user was saved
                    db.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
                        if (err) {
                            console.error("User Model - Error confirming insert:", err);
                            return reject(err);
                        }
                        console.log("User Model - Confirmed insert with data:", rows);
                        resolve(result);
                    });
                }
            );
        });
    }

    static async findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM users WHERE username = ?', 
                [username],
                (err, results) => {
                    if (err) {
                        console.error("User Model - Error finding user:", err);
                        reject(err);
                    }
                    console.log("User Model - Retrieved user:", results);
                    resolve(results[0]);
                }
            );
        });
    }
}

module.exports = User;
