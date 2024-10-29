const Member = require('../models/Member');

exports.getMembers = async (req, res) => {
    try {
        let members;
        if (req.isAuthenticated()) { // Check if the user is authenticated
            members = await Member.getAllMembers(); // Get member information for logged-in user
        } else {
            members = []; // No member data for unauthenticated users
        }
        res.render('memberInformation', { members }); // Render the memberInformation.ejs view with member data
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getMemberDetail = async (req, res) => {
    try {
        const member = await Member.getMemberById(req.params.id);
        if (!member) {
            return res.status(404).send('Member not found');
        }
        res.render('memberDetail', { member }); // Render the memberDetail.ejs view with member data
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
