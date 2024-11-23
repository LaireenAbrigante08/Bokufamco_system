const express = require('express');
const router = express.Router();
const EquipmentController = require('../controllers/equipmentController'); // Ensure this path matches your folder structure

// Route to handle equipment rentals page
router.get('/', EquipmentController.getEquipment);

// Route to view specific equipment by ID and prepare to rent
router.get('/:id', EquipmentController.rentEquipment); // This matches /equipment/17


module.exports = router;
