const db = require('../config/db'); // Ensure this path matches your project structure

class Equipment {
/////admin///////

static async markAsPaid(rentalId) {
    const query = 'UPDATE rentals SET status = ? WHERE id = ?';
    return db.execute(query, ['Paid', rentalId]);
}



////////////////////



////user func//////////////
static createRental(rentalData) {
    const { equipment_id, user_id, rental_start_date, rental_end_date, pickup_time, total_price } = rentalData;
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO rentals (equipment_id, user_id, rental_start_date, rental_end_date, pickup_time, total_price) VALUES (?, ?, ?, ?, ?, ?)',
            [equipment_id, user_id, rental_start_date, rental_end_date, pickup_time, total_price],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.insertId);
            }
        );
    });
}
static getRentalsByUserId(userId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT rentals.*, equipment.name AS equipment_name
            FROM rentals
            INNER JOIN equipment ON rentals.equipment_id = equipment.id
            WHERE rentals.user_id = ?`;

        db.query(sql, [userId], (err, results) => {
            if (err) {
                return reject(err);
            }

            // Format and validate rental data
            const formattedResults = results.map(rental => {
                rental.rental_start_date = new Date(rental.rental_start_date).toLocaleDateString('en-CA');
                rental.rental_end_date = new Date(rental.rental_end_date).toLocaleDateString('en-CA');
                rental.pickup_time = rental.pickup_time || 'N/A';

                // Handle NULL or unexpected rental_status
                const validStatuses = ['Pending', 'Confirmed', 'Returned', 'Canceled'];
                rental.rental_status = validStatuses.includes(rental.rental_status)
                    ? rental.rental_status
                    : 'Unknown';

                return rental;
            });

            resolve(formattedResults);
        });
    });
}

static updateRentalStatus(rentalsId, rental_status) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE rentals SET rental_status = ? WHERE id = ?`;
        db.query(sql, [rental_status, rentalsId], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

////////////////////////////////////////////////////
    // Get all equipment
    static getAllEquipment() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM equipment', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(results); // Log results to check data
                    resolve(results);
                }
            });
        });
    }

    // Add new equipment
    static addEquipment(name, description, picture, price, stockQuantity = 0, status = 'Available') {
        return new Promise((resolve, reject) => {
            // Validate that price is provided
            if (price === null || price === undefined || price === '') {
                reject(new Error('Price is required'));
                return;
            }
    
            const query = 'INSERT INTO equipment (name, description, picture, price, stock_quantity, status) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(query, [name, description, picture, price, stockQuantity, status], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    

    // Get equipment by ID for editing
    static getEquipmentById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM equipment WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

    // Update existing equipment
static updateEquipment(id, { name, description, picture, price, stockQuantity, status }) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE equipment
            SET name = ?, description = ?, picture = ?, price = ?, stock_quantity = ?, status = ?
            WHERE id = ?
        `;
        db.query(query, [name, description, picture, price, stockQuantity, status, id], (err, result) => {
            if (err) {
                console.error("Error updating equipment:", err);  // For better error tracking
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


    // Delete equipment by ID
    static deleteEquipment(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM equipment WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Equipment;
