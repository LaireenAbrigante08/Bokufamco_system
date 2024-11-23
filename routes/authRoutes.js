const express = require('express');
const authController = require('../controllers/authController');
console.log(authController); // Check if this logs an object with `register` and `login` functions

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
router.get('/profile', async (req, res) => {
    if (req.session.user) {
        try {
            const user = await User.findById(req.session.user.id); // Fetch user info from DB
            res.render('user-profile', { user }); // Pass user info to view
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
        try {
            const updatedUser = {
                username: req.body.username,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                contactNumber: req.body.contactNumber,
                dob: req.body.dob,
                gender: req.body.gender
            };

            // Update user info in DB
            await User.update(req.session.user.id, updatedUser); // Assuming you have an update method

            // After updating, redirect to the profile page
            res.redirect('/profile');
        } catch (error) {
            console.error('Error updating user info:', error);
            res.status(500).send('Error updating user information');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
