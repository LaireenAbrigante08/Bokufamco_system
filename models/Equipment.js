const db = require('../config/db'); // Ensure this path matches your project structure

class Equipment {
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
    static addEquipment(name, description, picture, rentalPrice, available) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO equipment (name, description, picture, rental_price, available) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [name, description, picture, rentalPrice, available], (err, result) => {
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
    static updateEquipment(id, name, description, picture, rentalPrice, available) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE equipment SET name = ?, description = ?, picture = ?, rental_price = ?, available = ? WHERE id = ?';
            db.query(query, [name, description, picture, rentalPrice, available, id], (err, result) => {
                if (err) {
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
