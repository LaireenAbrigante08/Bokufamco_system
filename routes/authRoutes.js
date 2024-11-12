const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Render the landing page
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

router.get('/members', authController.getMemberInformation);

// Logout route
router.get('/logout', authController.logout);

// Admin Dashboard Route
router.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.role === 'Admin') {
        res.render('admin'); // Render the admin dashboard
    } else {
        res.status(403).send('Access denied');
    }
});

module.exports = router;
