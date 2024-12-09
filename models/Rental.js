const db = require('../config/db');

// Save rental information to the database
const saveRental = (equipmentId, userId, startDate, endDate, paymentMethod, paymentAmount, callback) => {
    const query = `
        INSERT INTO rentals (equipment_id, user_id, start_date, end_date, rental_status, payment_method, payment_amount)
        VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `;

    db.query(query, [equipmentId, userId, startDate, endDate, paymentMethod, paymentAmount], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Get equipment details by ID
const getEquipmentById = (id, callback) => {
    const query = 'SELECT * FROM equipment WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
};

module.exports = {
    saveRental,
    getEquipmentById
};
