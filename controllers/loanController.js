const Loan = require('../models/Loan');
const Member = require('../models/Member'); 

class loanController {
    // Fetch loans for the logged-in user
    static async getLoans(req, res) {
        try {
            const loans = await Loan.getUserLoans(req.session.userId);
            res.render('loans', { loans });
        } catch (error) {
            console.error('Error fetching loans:', error);
            res.status(500).send('Failed to fetch loans.');
        }
    }

    // Show loan creation form
    static createLoanPage(req, res) {
        const loanTypes = Object.keys(Loan.loanTypes); // Get all loan types
        res.render('loanForm', { loanTypes });
    }

    // Handle loan creation
    static async createLoan(req, res) {
        const { loanAmount, loanType, loanDuration } = req.body; // Get loan amount, type, and duration from the form
        const userId = req.session.userId;

        // Calculate repayment details (interest amount and total repayment)
        const { interestAmount, totalRepayment } = Loan.calculateRepayment(loanAmount, loanType, parseInt(loanDuration));

        // Set the due date (adding loan duration in months to the current date)
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + parseInt(loanDuration)); // Adjust due date based on loan duration

        try {
            // Create the loan record
            await Loan.createLoan(
                userId, 
                loanAmount, 
                loanType, 
                parseInt(loanDuration), 
                interestAmount, 
                totalRepayment, 
                dueDate.toISOString().split('T')[0] // Format the date to YYYY-MM-DD
            );

            res.redirect('/loans'); // Redirect to loans list after successful creation
        } catch (error) {
            console.error('Error creating loan:', error);
            res.status(500).send('Failed to create loan.');
        }
    }

    // Method to cancel a loan
    static async cancelLoan(req, res) {
        const loanId = req.params.id;

        try {
            const loan = await Loan.getLoanById(loanId); // Fetch loan by ID

            if (!loan) {
                return res.status(404).send('Loan not found');
            }

            // Only allow cancellation if the loan status is 'pending'
            if (loan.loan_status !== 'pending') {
                return res.status(400).send('Loan cannot be canceled');
            }

            // Update loan status to 'canceled'
            await Loan.updateLoanStatus(loanId, 'canceled');

            // Redirect to loans page after canceling the loan
            res.redirect('/loans');
        } catch (error) {
            res.status(500).send('Error canceling loan: ' + error.message);
        }
    }

    // Controller to show the payment page for a specific loan
    static async showPaymentPage(req, res) {
        const loanId = req.params.id;

        try {
            const loan = await Loan.getLoanById(loanId);
            if (!loan) {
                return res.status(404).send('Loan not found');
            }

            // Ensure loan_amount and total_repayment are numbers before passing them to the view
            loan.loan_amount = parseFloat(loan.loan_amount);
            loan.total_repayment = parseFloat(loan.total_repayment);

            res.render('payment', { loan: loan });
        } catch (error) {
            console.error('Error retrieving loan:', error);
            res.status(500).send('Error retrieving loan');
        }
    }

    // Process payment for the loan
    static async processPayment(req, res) {
        const loanId = req.params.id;
        const { paymentAmount } = req.body;

        try {
            const loan = await Loan.getLoanById(loanId);
            if (!loan) {
                return res.status(404).send('Loan not found');
            }

            // Ensure payment is not greater than the remaining balance
            if (parseFloat(paymentAmount) > parseFloat(loan.total_repayment)) {
                return res.status(400).send('Payment exceeds total repayment amount');
            }

            // Record the payment in the loan_payments table
            await Loan.recordLoanPayment(loanId, paymentAmount);

            // Calculate the percentage to add to share capital (e.g., 10% of payment amount)
            const percentageToAdd = paymentAmount * 0.10;

            // Get the member associated with this loan
            const member = await Member.getMemberByLoanId(loanId);
            
            if (!member) {
                return res.status(404).send('Member not found');
            }

            // Update the share capital of the member
            await Member.updateShareCapital(member.user_id, percentageToAdd);

            // Initially, set loan status to 'pending' after payment until admin verifies
            await Loan.updateLoanStatus(loanId, 'pending');

            // Redirect to loans list after successful payment
            res.redirect('/loans');
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).send('Error processing payment');
        }
    }

    // Admin verifies loan payment and updates status
    static async verifyPayment(req, res) {
        const loanId = req.params.id;

        try {
            const loan = await Loan.getLoanById(loanId);
            if (!loan) {
                return res.status(404).send('Loan not found');
            }

            // Update the loan status to 'partially paid' after admin verification
            await Loan.updateLoanStatus(loanId, 'partially paid');

            // Redirect to loans list after successful verification
            res.redirect('/loans');
        } catch (error) {
            console.error('Error verifying payment:', error);
            res.status(500).send('Error verifying payment');
        }
    }
}

module.exports = loanController;
