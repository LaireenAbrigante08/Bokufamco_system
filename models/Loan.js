const db = require('../config/db'); // Adjust the path to your database connection

class Loan {
    static getAllLoans() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM loans', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static getUserLoans(memberId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM loans WHERE member_id = ?', [memberId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = Loan;
