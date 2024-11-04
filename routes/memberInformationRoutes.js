const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Route to display member details
router.get('/details', memberController.getMemberDetails);

// Route to save member details
router.post('/details', memberController.saveMemberDetails);

module.exports = router;
