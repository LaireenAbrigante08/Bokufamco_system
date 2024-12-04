const express = require('express');
const loanController = require('../controllers/loanController');
const isAuthenticated = require('../Middleware/auth');

const router = express.Router();

// Route to view all loans
router.get('/', isAuthenticated, loanController.getLoans); 

// Route to show loan creation form
router.get('/create', isAuthenticated, loanController.createLoanPage); 
router.post('/create-loan', loanController.createLoan);
// Route to handle loan creation
router.post('/create', isAuthenticated, loanController.createLoan);

// Route to cancel a loan (only for 'pending' loans)
router.post('/cancel/:id', isAuthenticated, loanController.cancelLoan); 

// Route to display the payment form for a loan
router.get('/pay/:id', isAuthenticated, loanController.showPaymentPage);

// Route to handle the payment submission
router.post('/pay/:id', isAuthenticated, loanController.processPayment);

module.exports = router;
