
const Member = require('../models/Member'); 
const db = require('../config/db');
const Loan = require('../models/Loan');

class loanController {
    ///////////////admin func/////////////////
  // Example of the controller logic for verifying payments
static async verifyPayment(req, res) {
    const paymentId = req.params.id;

    try {
        // Retrieve the payment details to validate before verification
        const query = `
            SELECT lp.loan_id, lp.payment_amount 
            FROM loan_payments lp 
            WHERE lp.id = ? AND (lp.is_verified = 0 OR lp.is_verified IS NULL)
        `;
        db.query(query, [paymentId], async (err, result) => {
            if (err) {
                console.error('Database error:', err);
                req.flash('error', 'Database query failed'); // Flash error message
                return res.redirect('/admin/payments'); // Redirect back to the payments page
            }

            if (!Array.isArray(result) || result.length === 0) {
                console.log('No unverified payment found or payment already verified.');
                req.flash('error', 'Payment not found or already verified'); // Flash error message
                return res.redirect('/admin/payments'); // Redirect back to the payments page
            }

            const { loan_id: loanId, payment_amount: paymentAmount } = result[0];

            try {
                await Loan.verifyPayment(paymentId, loanId, paymentAmount);
                console.log('Payment verified successfully.');
                req.flash('success', 'Payment verified successfully'); // Flash success message
                return res.redirect('/admin/payments'); // Redirect back to the payments page
            } catch (error) {
                console.error('Error verifying payment:', error);
                req.flash('error', 'Error verifying payment'); // Flash error message
                return res.redirect('/admin/payments'); // Redirect back to the payments page
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        req.flash('error', 'Unexpected error occurred'); // Flash error message
        return res.redirect('/admin/payments'); // Redirect back to the payments page
    }
}
// This method handles displaying the payments page
static async viewPayments(req, res) {
    try {
        // Fetch the payments data from your database
        const query = 'SELECT * FROM loan_payments';
        
        db.query(query, (err, payments) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Database error');
            }

            // Format the payment_date
            payments.forEach(payment => {
                const date = new Date(payment.payment_date);
                payment.payment_date = date.toISOString().slice(0, 19).replace('T', ' ');
            });

            // Render the payments page and pass the data and flash messages
            res.render('admin/payments', {
                payments: payments, // Pass the payments data to the view
                messages: {
                    success: req.flash('success'),
                    error: req.flash('error')
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).send('Unexpected error occurred');
    }
}

    
/////////////////////
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
    static async updateLoanStatus(loanId, status) {
        const query = 'UPDATE loans SET loan_status = ? WHERE id = ?';
        try {
            await db.execute(query, [status, loanId]);
        } catch (error) {
            console.error('Error updating loan status:', error);
            throw error;
        }
    }
    
    static async updateShareCapital(userId, amount) {
        const query = 'UPDATE members SET share_capital = share_capital + ? WHERE user_id = ?';
        try {
            await db.execute(query, [amount, userId]);
        } catch (error) {
            console.error('Error updating share capital:', error);
            throw error;
        }
    }
    
    static async getMemberByLoanId(loanId) {
        const query = `
            SELECT m.* FROM members m
            JOIN loans l ON m.user_id = l.user_id
            WHERE l.id = ?
        `;
        try {
            const [rows] = await db.execute(query, [loanId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error fetching member by loan ID:', error);
            throw error;
        }
    }
    
    static async recordLoanPayment(loanId, amount) {
        const query = 'INSERT INTO loan_payments (loan_id, payment_amount, payment_date) VALUES (?, ?, NOW())';
        try {
            await db.execute(query, [loanId, amount]);
        } catch (error) {
            console.error('Error recording loan payment:', error);
            throw error;
        }
    }
    
    static async getLoanById(loanId) {
        const query = 'SELECT * FROM loans WHERE id = ?';
        try {
            const [rows] = await db.execute(query, [loanId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error fetching loan by ID:', error);
            throw error;
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
    
        // Validate loan type and duration
        if (!loanType || !loanDuration || isNaN(loanAmount) || loanAmount <= 0) {
            return res.render('loanForm', {
                error: 'Invalid loan type, duration, or amount. Please provide valid details.'
            });
        }
    
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
    
            // Render a success page with the loan created message
            res.render('loanSuccess', {
                message: 'Loan successfully created! It is pending approval.',
                redirectUrl: '/' // This will be the link to return home or to the loans page
            });
    
        } catch (error) {
            console.error('Error creating loan:', error);
            res.render('loanForm', {
                error: 'An error occurred while processing your loan application. Please try again.'
            });
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
    
            // Format the due date (removes time and timezone)
            loan.due_date = new Date(loan.due_date).toLocaleDateString('en-GB'); // Change 'en-GB' to 'en-US' if needed for MM/DD/YYYY
    
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
            console.log('Processing payment for loan ID:', loanId, 'with amount:', paymentAmount);
    
            const loan = await Loan.getLoanById(loanId);
            if (!loan) {
                console.warn('Loan not found for ID:', loanId);
                return res.status(404).send('Loan not found');
            }
    
            console.log('Loan details retrieved:', loan);
    
            const remainingBalance = parseFloat(loan.remaining_balance);
            if (parseFloat(paymentAmount) > remainingBalance) {
                console.warn('Payment exceeds the remaining balance. Remaining:', remainingBalance);
                return res.status(400).send('Payment exceeds the remaining balance');
            }
    
            console.log('Recording payment...');
    
            // Record the payment and update the loan status
            await Loan.recordLoanPayment(loanId, paymentAmount);
    
            const newBalance = remainingBalance - parseFloat(paymentAmount);
            const status = newBalance === 0 ? 'paid' : 'partially paid';
            console.log('Updating loan status to:', status);
    
            await Loan.updateLoanStatus(loanId, status);
    
            console.log('Payment processed successfully. Redirecting...');
            res.redirect('/home');
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).send('Error processing payment');
        }
    }
    
}

module.exports = loanController;