const db = require('../config/db'); // Ensure this path matches your folder structure

class Equipment {
    static getAllEquipment() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM equipment', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static getUserEquipment() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM equipment WHERE available = "Yes"', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = Equipment;
