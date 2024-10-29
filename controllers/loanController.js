const Loan = require('../models/Loan');

exports.getLoans = async (req, res) => {
    try {
        let loans;
        if (req.isAuthenticated()) { // Check if the user is authenticated
            loans = await Loan.getUserLoans(req.user.id); // Get loans for logged-in user
        } else {
            loans = await Loan.getAllLoans(); // Get all loans for guests
        }
        res.render('loans', { loans }); // Render the loans.ejs view with loans data
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
