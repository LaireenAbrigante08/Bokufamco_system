const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Route for the loans page
router.get('/', loanController.getLoans);

module.exports = router;
