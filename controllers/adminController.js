// controllers/adminController.js
const Member = require('../models/Member'); // Import the Member model

exports.approveMember = async (req, res) => {
    const { userId } = req.params;  // Get the user_id from the URL

    try {
        // Update the member status to "approved"
        const result = await Member.updateStatus(userId, 'approved');

        if (result) {
            return res.status(200).json({ message: 'Member approved successfully' });
        } else {
            return res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while approving the member' });
    }
};
