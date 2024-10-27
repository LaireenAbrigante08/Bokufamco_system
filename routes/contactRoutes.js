const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route to display the contact page
router.get('/contact', contactController.contactPage);

module.exports = router;
