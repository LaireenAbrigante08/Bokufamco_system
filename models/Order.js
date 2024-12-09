const db = require('../config/db');

class Order {
    static findAll() {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT orders.id, orders.user_id, orders.status, orders.total_price, username AS user_name 
                FROM orders
                JOIN users ON orders.user_id = users.id`,
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
    }
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT orders.id, orders.user_id, orders.status, orders.total_price, username AS user_name 
                FROM orders
                JOIN users ON orders.user_id = users.id
                WHERE orders.id = ?`,
                [id],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]); // Assuming there's only one result with the given ID
                }
            );
        });
    }
    static updateStatus(orderId, newStatus) {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE orders SET status = ? WHERE id = ?',
                [newStatus, orderId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }
    // Fetch orders by user ID, including the status
    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT orders.id, orders.quantity, 
                        CAST(orders.total_price AS DECIMAL(10, 2)) AS total_price,
                        orders.created_at, orders.status, 
                        products.name AS product_name
                 FROM orders
                 JOIN products ON orders.product_id = products.id
                 WHERE orders.user_id = ?`,
                [userId],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
    }

    // Create a new order, including status
    static createOrder({ userId, productId, quantity, totalPrice, status = 'Pending' }) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
                [userId, productId, quantity, totalPrice, status],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.insertId);
                }
            );
        });
    }

    // Optionally, you can add a method to update the status
    static updateStatus(orderId, status) {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, orderId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }


}

module.exports = Order;
