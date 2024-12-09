const db = require('../config/db');  // Your MySQL database connection

// Rental Model Functions

// Create a new rental record
exports.createRental = async (rentalData) => {
    const { equipment_id, user_id, rental_start_date, rental_end_date, address } = rentalData;
    
    const query = `
        INSERT INTO rentals (equipment_id, user_id, rental_start_date, rental_end_date, address, status)
        VALUES (?, ?, ?, ?, ?, 'pending')`;
    
    const values = [equipment_id, user_id, rental_start_date, rental_end_date, address];
    
    try {
        const result = await db.execute(query, values);
        return result;
    } catch (error) {
        console.error('Error creating rental:', error);
        throw error;
    }
};

// Get rental by ID
exports.getRentalById = async (rentalId) => {
    const query = `SELECT * FROM rentals WHERE id = ?`;
    
    try {
        const [rows] = await db.execute(query, [rentalId]);
        return rows[0]; // Return the first row (rental)
    } catch (error) {
        console.error('Error fetching rental by ID:', error);
        throw error;
    }
};

// Update stock quantity of equipment after rental
exports.updateStockQuantity = async (equipmentId) => {
    const query = `
        UPDATE equipment
        SET stock_quantity = stock_quantity - 1
        WHERE id = ? AND stock_quantity > 0`;  // Ensuring stock is not negative

    try {
        await db.execute(query, [equipmentId]);
    } catch (error) {
        console.error('Error updating stock quantity:', error);
        throw error;
    }
};

// Update rental status (from pending to approved/completed, etc.)
exports.updateRentalStatus = async (rentalId, status) => {
    const query = `UPDATE rentals SET status = ? WHERE id = ?`;
    
    try {
        await db.execute(query, [status, rentalId]);
    } catch (error) {
        console.error('Error updating rental status:', error);
        throw error;
    }
};

// Get all rentals for a specific user (if needed)
exports.getRentalsByUserId = async (userId) => {
    const query = `SELECT * FROM rentals WHERE user_id = ?`;
    
    try {
        const [rows] = await db.execute(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching rentals for user:', error);
        throw error;
    }
};
