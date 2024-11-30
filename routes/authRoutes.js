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

router.get('/memberProfile', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    try {
        // Fetch user and member info
        const [[user]] = await db.promise().query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
        const [[member]] = await db.promise().query('SELECT * FROM members WHERE user_id = ?', [req.session.user.id]);

        if (user && member) {
            // Render profile with user and member data
            res.render('memberProfile', { user, member });
        } else {
            res.redirect('/dashboard'); // Redirect if data is missing
        }
    } catch (error) {
        console.error('Error fetching user or member:', error);
        res.status(500).send('Error fetching user or member data.');
    }
});


router.post('/update-profile', async (req, res) => {
    if (req.session.user) {
        const { email, first_name, middle_name, last_name, gender, contact_number } = req.body;

        // Validate input
        if (!email || !first_name || !last_name || !gender || !contact_number) {
            return res.status(400).send('All fields are required.');
        }

        try {
            // Update the user's email in the `users` table
            const [userUpdateResult] = await db.promise().query(
                'UPDATE users SET email = ? WHERE id = ?',
                [email, req.session.user.id]
            );

            if (userUpdateResult.affectedRows === 0) {
                return res.status(404).send('User not found');
            }

            // Update member details in the `members` table
            const [memberUpdateResult] = await db.promise().query(
                'UPDATE members SET first_name = ?, middle_name = ?, last_name = ?, gender = ?, contact_number = ? WHERE user_id = ?',
                [first_name, middle_name, last_name, gender, contact_number, req.session.user.id]
            );

            if (memberUpdateResult.affectedRows === 0) {
                return res.status(404).send('Member details not found');
            }

            // Redirect after successful update
            res.redirect('/memberProfile');
        } catch (error) {
            console.error('Error updating user or member info:', error);
            res.status(500).send('Error updating profile.');
        }
    } else {
        res.redirect('/login');
    }
});

router.post('/edit-address', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const { address, contact_number } = req.body;

    // Validate input
    if (!address || !contact_number) {
        return res.status(400).send('All required fields must be filled.');
    }

    try {
        // Update the address in the `members` table
        const [result] = await db.promise().query(
            `UPDATE members 
             SET address = ?, 
                 contact_number = ?, 
             WHERE user_id = ?`,
            [address, contact_number, address_type, req.session.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Member not found.');
        }

        res.redirect('/memberProfile'); // Redirect back to the profile page
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).send('Error updating address.');
    }
});

module.exports = router;
