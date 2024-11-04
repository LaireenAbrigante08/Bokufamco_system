const Member = require('../models/Member');

const memberController = {
    getMemberDetails: async (req, res) => {
        const memberId = req.session.user.id; // Assuming user ID is stored in session
        try {
            const member = await Member.findById(memberId);
            res.render('memberDetails', {
                member,
            });
        } catch (error) {
            console.error('Error fetching member details:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    saveMemberDetails: async (req, res) => {
        const memberId = req.session.user.id; // Get the user ID from session
        const { name, email, phone, address, picture } = req.body;
        try {
            await Member.updateMember(memberId, { name, email, phone, address, picture });
            res.redirect('/members/details'); // Redirect to view updated details
        } catch (error) {
            console.error('Error saving member details:', error);
            res.status(500).send('Internal Server Error');
        }
    },
};

module.exports = memberController;
