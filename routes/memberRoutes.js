const express = require('express');
const router = express.Router();
const { getMemberForm, updateMember } = require('../controllers/memberController');


// Route to get member details for a given member id
router.get('/profile/:id', getMemberForm);

// Route to update member information
router.post('/profile/:id', updateMember);

module.exports = router;
