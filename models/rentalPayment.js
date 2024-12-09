const db = require('../config/db');

// Add a rental payment (with verification as unverified initially)
const addRentalPayment = (rental_id, loan_id, member_id, payment_amount, payment_method, verification_status, callback) => {
    const query = `
        INSERT INTO rental_payments (rental_id, loan_id, member_id, payment_amount, payment_method, payment_status, verification_status)
        VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `;
    db.query(query, [rental_id, loan_id, member_id, payment_amount, payment_method, verification_status], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Verify payment (admin action)
const verifyPayment = (payment_id, callback) => {
    const query = `
        UPDATE rental_payments
        SET verification_status = 'verified', payment_status = 'completed'
        WHERE id = ?
    `;
    db.query(query, [payment_id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Get unverified payments for admin to approve
const getUnverifiedPayments = (callback) => {
    const query = `
        SELECT * FROM rental_payments
        WHERE verification_status = 'unverified'
    `;
    db.query(query, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = { addRentalPayment, verifyPayment, getUnverifiedPayments };
