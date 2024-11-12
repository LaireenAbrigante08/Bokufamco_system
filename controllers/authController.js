const bcrypt = require('bcrypt');
const db = require('../config/db'); // Make sure your database connection is set up in db.js

// Register a new user
exports.register = (req, res) => {
    const { username, password, email } = req.body;

    // Check if the username or email already exists
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
            return res.status(500).send('Database error');
        }

        if (results.length > 0) {
            req.session.error = 'Username or email already exists';
            return res.redirect('/register');
        }

        // Hash the password before saving
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).send('Error hashing password');
            }

            // Insert new user into the database
            db.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
                     [username, hashedPassword, email, 'User'], (err, result) => {
                if (err) {
                    return res.status(500).send('Error registering user');
                }

                req.session.successMessage = 'Registration successful! Please log in.';
                return res.redirect('/login');
            });
        });
    });
};

// Login an existing user
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            req.session.error = 'Invalid username or password';
            return res.redirect('/login');
        }

        const user = results[0];

        // Compare the password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send('Error comparing passwords');
            }

            if (isMatch) {
                // Set user session and redirect to the appropriate home page based on role
                req.session.user = user;
                return user.role === 'Admin' ? res.redirect('/admin') : res.redirect('/home');
            } else {
                req.session.error = 'Invalid username or password';
                return res.redirect('/login');
            }
        });
    });
};

exports.getMemberInformation = (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/login');
    }

    db.query('SELECT user_id FROM members WHERE user_id = ?', [user.id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send('Database error');
        }

        if (result.length === 0) {
            return res.status(404).send('Member information not found');
        }

        // Include user_id in the user object for rendering in EJS
        res.render('memberInformation', { user: { ...user, user_id: result[0].user_id } });
    });
};


// Logout the user
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');
    });
};
