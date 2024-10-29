const db = require('../config/db'); // Adjust the path to your database connection

class Product {
    static getAllProducts() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM products', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }
}

module.exports = Product;
