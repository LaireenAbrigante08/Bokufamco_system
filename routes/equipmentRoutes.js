const express = require('express');
const router = express.Router();
const EquipmentController = require('../controllers/equipmentController'); // Ensure this path matches your folder structure

// Route to handle equipment rentals page (list of all equipment)
router.get('/equipment',  EquipmentController.getEquipment);
router.get('/equipment/:id/rent', EquipmentController.getRentForm);
router.post('/submit-rental',  EquipmentController.submitRental);
router.get('/myrent', EquipmentController.getRentalStatus);
router.post('/cancelRental',EquipmentController.cancelRental);
router.post('/pay/:id', EquipmentController.payRental);
module.exports = router;
