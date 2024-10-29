// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Protect admin routes with isAdmin middleware
router.get('/dashboard', authController.isAdmin, (req, res) => {
    res.render('adminDashboard');
});

module.exports = router;
