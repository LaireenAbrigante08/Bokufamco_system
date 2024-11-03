const express = require('express');
const User = require('../models/User'); // Make sure you have the correct model imported
const router = express.Router();

// Route to get member information
router.get('/members', async (req, res) => {
    try {
        const members = await User.getAllMembers(); // A method you'll create to fetch all members
        res.render('memberInformation', { members });
    } catch (err) {
        console.error("Error fetching members:", err);
        res.status(500).send('Error fetching members');
    }
});

module.exports = router;
