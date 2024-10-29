// models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async createUser(username, email, password, role) {
        const hashedPassword = await bcrypt.hash(password, 8);

        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
                [username, email, hashedPassword, role],
                (err, result) => {
                    if (err) {
                        console.error("User Model - Database error on insert:", err);
                        return reject(err);
                    }
                    console.log("User Model - Insert successful:", result);
                    resolve(result);
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
                        return reject(err);
                    }
                    console.log("User Model - Retrieved user:", results);
                    resolve(results[0]);
                }
            );
        });
    }
}

module.exports = User;
