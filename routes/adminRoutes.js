const express = require('express');
const router = express.Router();

// Admin Dashboard Route
router.get('/adminDashboard', (req, res) => {
    // Check if the user is logged in and is an admin
    if (req.session.user && req.session.user.role === 'admin') {
        res.render('adminDashboard'); // Render the admin dashboard
    } else {
        res.status(403).send('Access denied'); // Forbidden access
    }
});

// Admin Dashboard Routes
router.get('/member', (req, res) => {
    res.render('admin/member'); // Path to your EJS file
});

router.get('/equipment', (req, res) => {
    res.render('admin/equipment'); // Path to your EJS file
});

router.get('/supplies', (req, res) => {
    res.render('admin/supplies'); // Path to your EJS file
});

router.get('/loans', (req, res) => {
    res.render('admin/loans'); // Path to your EJS file
});

module.exports = router;
