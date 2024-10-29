const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route for the farm supplies page
router.get('/', productController.getFarmSupplies);

module.exports = router;
