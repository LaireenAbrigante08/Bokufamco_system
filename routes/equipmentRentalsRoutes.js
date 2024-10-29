// routes/equipmentRentalsRoute.js
const express = require('express');
const router = express.Router();

// Route for the equipment rentals page
router.get('/', (req, res) => {
    res.render('equipment-rentals'); // Render the equipment-rentals.ejs view
});

module.exports = router;
