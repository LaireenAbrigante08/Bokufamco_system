const express = require('express');
const authController = require('../controllers/authController');
console.log(authController); // Check if this logs an object with `register` and `login` functions
const db = require('../config/db');
const router = express.Router();

// Routes setup
router.get('/landing', (req, res) => res.render('landing'));

// Render the login page with an error message if it exists
router.get('/login', (req, res) => {
    const error = req.session.error || null; // Get any error message from the session
    req.session.error = null; // Clear the error message after rendering
    res.render('login', { error });
});

// Render the registration page
router.get('/register', (req, res) => res.render('register'));

// Handle registration and login
router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await authController.login(username, password); // Authenticate user
        if (!user) {
            req.session.error = 'Invalid credentials';
            return res.redirect('/login');
        }

        req.session.user = user; // Store user info in session
        req.session.userId = user.id;

        // Fetch member details
        const [member] = await db.promise().query('SELECT id FROM members WHERE user_id = ?', [user.id]);
        if (member.length > 0) {
            req.session.memberId = member[0].id;
        } else {
            req.session.memberId = null; // Set as null if no member record found
        }

        // Redirect based on role
        if (user.role === 'Admin') return res.redirect('/admin');
        res.redirect('/home');
    } catch (err) {
        console.error('Login error:', err);
        req.session.error = 'An error occurred during login.';
        res.redirect('/login');
    }
});

router.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.role === 'Admin') {
        res.render('admin');
    } else {
        res.status(403).send('Access denied');
    }
});

// Route to display user profile
router.get('/memberProfile', async (req, res) => {
    if (req.session.user) {
        try {
            const [user] = await db.promise().query('SELECT * FROM users WHERE id = ?', [req.session.user.id]); // Fetch user info from DB
            const member = await db.promise().query('SELECT * FROM members WHERE user_id = ?', [req.session.user.id]); // Fetch member info
            
            if (user.length > 0) {
                res.render('memberProfile', { user: user[0], member: member[0] });
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('Error fetching user data');
        }
    } else {
        res.redirect('/login');
    }
});

// Route to handle profile update
router.post('/update-profile', async (req, res) => {
    if (req.session.user) {
        const { username, email, firstName, lastName, address, contactNumber, dob, gender } = req.body;

        try {
            // Update user info in DB
            await db.promise().query(
                'UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ?, address = ?, contact_number = ?, dob = ?, gender = ? WHERE id = ?',
                [username, email, firstName, lastName, address, contactNumber, dob, gender, req.session.user.id]
            );

            // Optionally update the member's profile
            await db.promise().query(
                'UPDATE members SET first_name = ?, last_name = ?, address = ?, contact_number = ? WHERE user_id = ?',
                [firstName, lastName, address, contactNumber, req.session.user.id]
            );

            // After updating, redirect to the profile page
            res.redirect('/memberProfile');
        } catch (error) {
            console.error('Error updating user info:', error);
            res.status(500).send('Error updating user information');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
