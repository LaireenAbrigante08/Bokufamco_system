const express = require('express');
const router = express.Router();
const EquipmentController = require('../controllers/equipmentController'); // Ensure this path matches your folder structure
const { rentEquipment } = require('../controllers/equipmentController'); // Import the controller

// Route to handle equipment rentals page
router.get('/', EquipmentController.getEquipment);

// View specific equipment by ID and prepare to rent
router.get('/equipment/:id', rentEquipment);

module.exports = router;
