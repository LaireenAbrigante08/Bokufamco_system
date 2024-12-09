const db = require('../config/db'); // Assuming you have a db configuration file
//console.log('Loan model:', Loan);

class Loan {
    
// Record a loan payment (with verification flag)
static async recordLoanPayment(loanId, paymentAmount) {
    return new Promise((resolve, reject) => {
        // Insert payment with is_verified flag set to false initially
        const sqlInsert = `
            INSERT INTO loan_payments (loan_id, payment_amount, payment_date, is_verified) 
            VALUES (?, ?, NOW(), false)
        `;
        db.query(sqlInsert, [loanId, paymentAmount], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}
// Model for verifying payment
static async verifyPayment(paymentId, loanId, paymentAmount) {
    return new Promise((resolve, reject) => {
        // Step 1: Mark payment as verified
        const sqlVerify = `
            UPDATE loan_payments 
            SET is_verified = true 
            WHERE id = ?
        `;
        db.query(sqlVerify, [paymentId], (err, result) => {
            if (err) {
                console.error("Error verifying payment:", err);
                return reject(err);
            }

            // Step 2: Update loan balance
            const sqlUpdateLoan = `
                UPDATE loans
                SET remaining_balance = remaining_balance - ?
                WHERE id = ?
            `;
            db.query(sqlUpdateLoan, [paymentAmount, loanId], (err, loanUpdateResult) => {
                if (err) {
                    console.error("Error updating loan balance:", err);
                    return reject(err);
                }

                // Step 3: Update share capital
                const shareCapitalIncrease = paymentAmount * 0.2;
                console.log("Share Capital Increase:", shareCapitalIncrease);

                const sqlUpdateCapital = `
                    UPDATE members 
                    SET share_capital = share_capital + ? 
                    WHERE user_id = (SELECT user_id FROM loans WHERE id = ?);
                `;
                db.query(sqlUpdateCapital, [shareCapitalIncrease, loanId], (err, capitalUpdateResult) => {
                    if (err) {
                        console.error("Error updating share capital:", err);
                        return reject(err);
                    }
                    resolve(capitalUpdateResult);
                });
            });
        });
    });

}

    // Get loan details by loan ID
    static getLoanById(loanId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM loans WHERE id = ?`;
            db.query(sql, [loanId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]); // Return a single loan
            });
        });
    }

    // Get all loans
    static getAllLoans() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT loans.*, members.first_name, members.last_name
                FROM loans
                INNER JOIN members ON loans.user_id = members.id
            `;
            db.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    

    // Fetch loans for a specific user
    static getUserLoans(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM loans WHERE user_id = ?`;
            db.query(sql, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Create a new loan
    static async createLoan(userId, loanAmount, loanType, loanDuration, interestAmount, totalRepayment, dueDate) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO loans (user_id, loan_amount, loan_type, interest_rate, loan_status, months_to_pay, due_date, interest_amount, total_repayment, remaining_balance, created_at)
                VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, NOW())
            `;
            const interestRate = Loan.loanTypes[loanType]?.interestRates[loanDuration];
            if (!interestRate) {
                return reject(new Error('Invalid loan type or duration'));
            }
            db.query(sql, [userId, loanAmount, loanType, interestRate, loanDuration, dueDate, interestAmount, totalRepayment, totalRepayment], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    // Calculate repayment details
    static calculateRepayment(loanAmount, loanType, loanDuration) {
        const loanTypeDetails = Loan.loanTypes[loanType];
        if (!loanTypeDetails || !loanTypeDetails.interestRates[loanDuration]) {
            throw new Error('Invalid loan type or duration');
        }
    
        // Ensure loanAmount is a number
        loanAmount = parseFloat(loanAmount);
        if (isNaN(loanAmount)) {
            throw new Error('Invalid loan amount');
        }
    
        const interestRate = loanTypeDetails.interestRates[loanDuration];
        const interestAmount = parseFloat((loanAmount * interestRate * loanDuration).toFixed(2));
        const totalRepayment = parseFloat((loanAmount + interestAmount).toFixed(2));
    
        return { interestAmount, totalRepayment };
    }
    
    
    static checkDuplicatePayment(loanId, paymentAmount) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM loan_payments WHERE loan_id = ? AND payment_amount = ?';
            db.query(sql, [loanId, paymentAmount], (err, result) => {
                if (err) {
                    return reject(err);
                }
                // Return true if a payment with the same amount exists
                resolve(result.length > 0);
            });
        });}
    // Update loan status
    static updateLoanStatus(loanId, status) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE loans SET loan_status = ? WHERE id = ?`;
            db.query(sql, [status, loanId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}



// Predefined loan types and interest rates
Loan.loanTypes = {
    'Coconut Farming': {
        interestRates: {
            1: 0.2,  // 20% per month
            2: 0.4,  // 40% for 2 months
            3: 0.5   // 50% for 3 months
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


module.exports = Loan;
