const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

// Show the rent form for a specific equipment item
router.get('/equipment/:id/rent', rentalController.renderRentForm);

// Handle the rental form submission
router.post('/equipment/:id/rent', rentalController.submitRentalForm);

module.exports = router;
