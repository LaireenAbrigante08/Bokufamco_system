const express = require('express');
const router = express.Router();
const EquipmentController = require('../controllers/equipmentController'); // Ensure this path matches your folder structure

// Route to handle equipment rentals page
router.get('/', EquipmentController.getEquipment);

module.exports = router;
