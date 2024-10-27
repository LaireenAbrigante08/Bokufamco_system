const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Route to display the about page
router.get('/about', aboutController.aboutPage);

module.exports = router;
