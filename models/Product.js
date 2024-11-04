const db = require('../config/db'); // Adjust the path to your database connection

class Product {
    // Get all products
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

    // Find product by ID
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

    // Add a new product
    static addProduct({ name, description, picture, price, stock }) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO products (name, description, picture, price, stock) VALUES (?, ?, ?, ?, ?)',
                [name, description, picture, price, stock],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.insertId); // Return the ID of the new product
                    }
                }
            );
        });
    }

    // Update an existing product
    static updateProduct(id, { name, description, picture, price, stock }) {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE products SET name = ?, description = ?, picture = ?, price = ?, stock = ? WHERE id = ?',
                [name, description, picture, price, stock, id],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.affectedRows); // Return the number of affected rows
                    }
                }
            );
        });
    }

    // Delete a product by ID
    static deleteProduct(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows); // Return the number of affected rows
                }
            });
        });
    }
}

module.exports = Product;
