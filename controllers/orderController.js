const db = require('../config/db');
const Order = require('../models/Order'); // Assuming you have an Order model

// Get all orders
exports.getAllOrders = (req, res) => {
    Order.findAll()
        .then(orders => {
            res.render('admin/orders', { orders }); // Render orders page and pass orders data
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching orders');
        });
};

// Get order details by ID (for editing or viewing)
exports.getOrderById = (req, res) => {
    const orderId = req.params.id;

    // Assuming Order.findById is working correctly
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return res.status(404).send('Order not found');
            }

            // Fetch the products related to the order using the order_id in products table
            db.query('SELECT * FROM products WHERE order_id = ?', [orderId], (err, products) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }

                // Assign products to the order object
                order.products = products;

                // Render the order details page with the order and its products
                res.render('admin/orderDetails', { order });
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
};


// Update order status
exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body; // Assuming status is sent in the request body

    Order.updateStatus(orderId, status)
        .then(() => {
            res.redirect('/admin/orders'); // Redirect back to orders page after update
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error updating order status');
        });
};
