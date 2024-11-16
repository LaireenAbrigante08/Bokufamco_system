const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async createUser(username, email, password, role) { // Ensure the role is included
        const hashedPassword = await bcrypt.hash(password, 8);

        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
                [username, email, hashedPassword, role], // Include role in the query
                (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            console.error("User Model - Duplicate entry:", err);
                            return reject(new Error('Username or email already exists.'));
                        }
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
                        reject(err);
                    }
                    console.log("User Model - Retrieved user:", results[0]);
                    resolve(results[0]);
                }
            );
        });
    }

    // User model
    static async getAllMembers() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE role = "User/Member"', (err, results) => {
                if (err) {
                    console.error("User Model - Error fetching members:", err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

}

// Find a user by ID
User.findById = async (userId) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0]; // Return user if found, otherwise null
};

// Update user info by ID
User.update = async (userId, updatedUser) => {
    const { username, email, firstName, lastName, address, contactNumber, dob, gender } = updatedUser;
    const [result] = await db.query(`
        UPDATE users 
        SET username = ?, email = ?, firstName = ?, lastName = ?, address = ?, contactNumber = ?, dob = ?, gender = ?
        WHERE id = ?`, [username, email, firstName, lastName, address, contactNumber, dob, gender, userId]);
    return result;
};
module.exports = User;
