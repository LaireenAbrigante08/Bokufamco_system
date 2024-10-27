const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async createUser(username, password) {
        const hashedPassword = await bcrypt.hash(password, 8);
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static async findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }
}

module.exports = User;
