// controllers/adminController.js
const Member = require('../models/Member'); // Import the Member model
const Loan = require('../models/Loan');

// Route to display all loans for admin
exports.getAdminLoans = (req, res) => {
    Loan.getAllLoans() 
        .then(loans => {
            res.render('admin/loans', { loans }); // Specify the correct path here
        })
        .catch(err => {
            res.status(500).send("Error fetching loans: " + err);
        });
};

// Route to update loan status
exports.updateLoanStatus = (req, res) => {
    const loanId = req.params.id;
    const newStatus = req.body.status;

    Loan.updateLoanStatus(loanId, newStatus) // Method in Loan model to update status
        .then(() => {
            res.redirect('/admin/loans'); // Redirect back to the loan management page
        })
        .catch(err => {
            res.status(500).send("Error updating loan status: " + err);
        });
};



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

