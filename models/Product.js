const db = require('../config/db'); // Adjust the path to your database connection

class Product {
    // Get all products
    static getAllProducts() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM products', (err, results) => {
                if (err) {
                    console.error('Database error on fetching products:', err);
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
                    console.error('Database error on fetching product by ID:', err);
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
                        console.error('Database error on adding product:', err);
                        reject(err);
                    } else {
                        resolve(result.insertId);
                    }
                }
            );
        });
    }

    static updateProduct(id, { name, description, picture, price, stock }) {
        const fields = [name, description, price, stock];
        let query = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?';
    
        if (picture) {
            query += ', picture = ?';
            fields.push(picture);
        }
        query += ' WHERE id = ?';
        fields.push(id);
    
        return new Promise((resolve, reject) => {
            db.query(query, fields, (err, result) => {
                if (err) {
                    console.error('Database error on updating product:', err);
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    }
    
    

    // Delete a product by ID
    static deleteProduct(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
                if (err) {
                    console.error('Database error on deleting product:', err);
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    }
}

module.exports = Product;
