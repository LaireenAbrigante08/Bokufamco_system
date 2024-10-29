const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Route for the member information page
router.get('/', memberController.getMembers);

// Route for individual member details
router.get('/:id', memberController.getMemberDetail);

module.exports = router;
