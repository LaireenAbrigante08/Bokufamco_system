const db = require('../config/db'); // Assuming you have a db configuration file

class Loan {
    ////////////////////////////////////////////////////////////
    //for payments
    static recordLoanPayment(loanId, paymentAmount) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO loan_payments (loan_id, payment_amount) VALUES (?, ?)`;
            db.query(sql, [loanId, paymentAmount], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    
    // Method to get loan details by loan ID
    static getLoanById(loanId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM loans WHERE id = ?`;
            db.query(sql, [loanId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }
    
    // Method to update loan status
    static updateLoanStatus(loanId, status) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE loans SET loan_status = ? WHERE id = ?`;
            db.query(sql, [status, loanId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    ////////////////////////////////////////////////////////////////////////////
    // Method to update the loan status
    static updateLoanStatus(loanId, status) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE loans SET loan_status = ? WHERE id = ?`;
            db.query(sql, [status, loanId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Method to get all loans
    static getAllLoans() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM loans`;
            db.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
////////////////////////////////////////////////////////////////////////////////////////////
////view for user
static getLoanById(loanId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM loans WHERE id = ?';
        db.query(sql, [loanId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.length > 0) {
                    resolve(results[0]); // Return the first (and only) loan
                } else {
                    resolve(null); // No loan found with that id
                }
            }
        });
    });
}
    // Predefined loan types and interest rates based on loan amount and duration in months
    static loanTypes = {
        'Coconut Farming': {
            interestRates: {
                1: 0.2,  // 30% per month
                2: 0.4, // 25% per month
                3: 0.5   // 20% per month
            }
        },
        'Personal': {
            interestRates: {
                1: 0.2,  // 20% per month
                2: 0.15, // 15% per month
                3: 0.1   // 10% per month
            }
        }
    };

    // Fetch loans for a specific user
    static getUserLoans(userId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM loans WHERE user_id = ?', [userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Create a new loan entry
    static async createLoan(userId, loanAmount, loanType, loanDuration, interestAmount, totalRepayment, dueDate) {
        return new Promise((resolve, reject) => {
            // Validate loan type and duration
            if (!Loan.loanTypes[loanType]) {
                return reject(new Error(`Invalid loan type: ${loanType}`));
            }

            if (!Loan.loanTypes[loanType].interestRates[loanDuration]) {
                return reject(new Error(`Invalid loan duration: ${loanDuration} for loan type: ${loanType}`));
            }

            const sql = `
                INSERT INTO loans (user_id, loan_amount, loan_type, interest_rate, loan_status, months_to_pay, due_date, interest_amount, total_repayment, created_at)
                VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, NOW())
            `;
            const interestRate = Loan.loanTypes[loanType].interestRates[loanDuration]; // Get interest rate based on loan type and duration

            console.log(`Creating loan for type: ${loanType}, duration: ${loanDuration}, interest rate: ${interestRate}`); // Debugging log

            db.query(sql, [userId, loanAmount, loanType, interestRate, loanDuration, dueDate, interestAmount, totalRepayment], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Function to calculate interest amount and total repayment dynamically
    static calculateRepayment(loanAmount, loanType, loanDuration) {
        // Validate loan type and duration
        if (!Loan.loanTypes[loanType]) {
            throw new Error(`Invalid loan type: ${loanType}`);
        }

        if (!Loan.loanTypes[loanType].interestRates[loanDuration]) {
            throw new Error(`Invalid loan duration: ${loanDuration} for loan type: ${loanType}`);
        }

        const interestRate = Loan.loanTypes[loanType].interestRates[loanDuration];

        console.log(`Calculating repayment for type: ${loanType}, duration: ${loanDuration}, interest rate: ${interestRate}`); // Debugging log

        const interestAmount = (loanAmount * interestRate * loanDuration).toFixed(2);
        const totalRepayment = (parseFloat(loanAmount) + parseFloat(interestAmount)).toFixed(2);
        return { interestAmount, totalRepayment };
    }
}

module.exports = Loan;
