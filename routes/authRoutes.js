const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/landing', (req, res) => res.render('landing'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);


// Admin Dashboard Route
router.get('/admin', (req, res) => {
    // Check if the user is logged in and is an admin
    if (req.session.user && req.session.user.role === 'Admin') {
        res.render('admin'); // Render the admin dashboard
    } else {
        res.status(403).send('Access denied'); // Forbidden access
    }
});


module.exports = router;
