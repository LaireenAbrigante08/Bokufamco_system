// routes/memberRoutes.js

const express = require('express');
const router = express.Router();

// Importing the controller with db connection
module.exports = (db) => {
    const memberController = require('../controllers/memberController')(db); 

    // Route to render the member form (for creating a new member)
    router.get('/', (req, res) => {
        memberController.getMemberForm(req, res);
    });

    // Route to handle form submission and save member data
    router.post('/save', (req, res) => {
        memberController.saveMember(req, res);
    });

    return router;
};
