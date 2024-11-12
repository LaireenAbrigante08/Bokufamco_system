// routes/memberRoutes.js
const express = require('express');
const router = express.Router();

// Importing the controller with db connection
module.exports = (db) => {
    const memberController = require('../controllers/memberController')(db);

    // Route to render the member form (for editing/updating a member)
    router.get('/', (req, res) => {
        memberController.getMemberForm(req, res);
    });

    // Route to handle form submission and save/update member data
    router.post('/update', (req, res) => { // Updated the path to '/update'
        memberController.updateMember(req, res);
    });

    router.post('/save', (req, res) => {
        const { user_id, address, contact_number } = req.body;
    
        const sql = 'INSERT INTO members (user_id, address, contact_number) VALUES (?, ?, ?)';
        db.query(sql, [user_id, address, contact_number], (err, result) => {
            if (err) throw err;
            req.session.successMessage = 'Member information saved successfully';
            res.redirect('/members');
        });
    });

    return router;
};
