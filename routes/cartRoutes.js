const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your existing MySQL2 connection

// Render Cart Page
router.get('/cart', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login'); // Redirect to login if the user isn't authenticated
    }

    // Fetch cart items, including product names, by joining with the products table
    db.query(
        `SELECT c.id AS cart_id, 
                p.name AS product_name, 
                c.quantity, 
                c.price, 
                (c.quantity * c.price) AS total 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ?`,
        [userId],
        (error, results) => {
            if (error) {
                console.error('Error fetching cart items:', error);
                return res.status(500).send('Unable to fetch cart data');
            }

            if (results.length === 0) {
                return res.render('cart', { cartItems: null, cartTotal: 0 });
            }

            // Calculate the total cart value
            const cartTotal = results.reduce((total, item) => total + item.total, 0);

            // Render cart page with cart items and total value
            res.render('cart', { cartItems: results, cartTotal: cartTotal });
        }
    );
});

// Remove item from cart and update stock
router.post('/cart/remove/:id', (req, res) => {
    const itemId = req.params.id;

    // Fetch the product ID and quantity to restore stock
    db.query(
        `SELECT product_id, quantity 
         FROM cart 
         WHERE id = ?`,
        [itemId],
        (error, results) => {
            if (error) {
                console.error('Error fetching item to remove:', error);
                return res.status(500).send('Unable to remove item');
            }

            if (results.length === 0) {
                return res.status(404).send('Item not found');
            }

            const { product_id, quantity } = results[0];

            // Remove the item from the cart
            db.query('DELETE FROM cart WHERE id = ?', [itemId], (error) => {
                if (error) {
                    console.error('Error removing item from cart:', error);
                    return res.status(500).send('Unable to remove item');
                }

                // Restore stock in the products table
                db.query(
                    'UPDATE products SET stock = stock + ? WHERE id = ?',
                    [quantity, product_id],
                    (error) => {
                        if (error) {
                            console.error('Error updating stock after removing item:', error);
                            return res.status(500).send('Unable to update stock');
                        }

                        // Redirect back to cart after removal
                        res.redirect('/cart');
                    }
                );
            });
        }
    );
});

// Update item quantity in the cart
router.post('/cart/update-quantity/:id', (req, res) => {
    const { id } = req.params; // Cart item ID
    const { quantity } = req.body; // New quantity

    // Validate quantity input
    if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    // Update the quantity in the cart table
    db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], (error) => {
        if (error) {
            console.error('Error updating cart:', error);
            return res.status(500).json({ success: false, error: 'Failed to update cart' });
        }

        // Get updated cart total
        db.query('SELECT * FROM cart WHERE user_id = ?', [req.session.userId], (error, cartItems) => {
            if (error) {
                console.error('Error fetching cart items:', error);
                return res.status(500).json({ success: false, error: 'Failed to fetch cart items' });
            }

            const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            res.json({ success: true, cartTotal });
        });
    });
});

// Add item to the cart
router.post('/add-to-cart/:id', (req, res) => {
    const productId = req.params.id;
    const userId = req.session.userId; // Assuming session authentication
    const quantity = parseInt(req.body.quantity, 10); // Get the quantity from the request body

    if (!userId) {
        return res.redirect('/login'); // Redirect to login if unauthenticated
    }

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).send('Invalid quantity');
    }

    // Fetch the product details
    db.query('SELECT name, price, stock FROM products WHERE id = ?', [productId], (error, results) => {
        if (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Unable to fetch product data');
        }

        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }

        const { name, price, stock } = results[0];

        // Check if stock is sufficient
        if (stock < quantity) {
            return res.status(400).send('Insufficient stock');
        }

        // Add or update the product in the user's cart
        db.query(
            'INSERT INTO cart (user_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)', 
            [userId, productId, name, quantity, price],
            (error) => {
                if (error) {
                    console.error('Error adding product to cart:', error);
                    return res.status(500).send('Unable to add product to cart');
                }

                // Reduce stock in the `products` table
                db.query(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [quantity, productId],
                    (error) => {
                        if (error) {
                            console.error('Error updating product stock:', error);
                            return res.status(500).send('Unable to update product stock');
                        }

                        res.redirect('/cart'); // Redirect to cart page after adding
                    }
                );
            }
        );
    });
});

// Render Checkout Form
router.get('/checkout', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login'); // Redirect to login if unauthenticated
    }

    // Fetch cart items for the user
    db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (error, cartItems) => {
        if (error) {
            console.error('Error fetching cart items:', error);
            return res.status(500).send('Unable to fetch cart items');
        }

        // Calculate total price
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

        res.render('checkout', { cartItems, totalPrice });
    });
});

// Handle Checkout (Place Order)
router.post('/checkout', (req, res) => {
    const userId = req.session.userId;
    const { deliveryAddress, paymentMethod } = req.body;

    if (!userId) {
        return res.redirect('/login');
    }

    // Fetch cart items for checkout, including the picture (image_url)
    db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (error, cartItems) => {
        if (error) {
            console.error('Error fetching cart items:', error);
            return res.status(500).send('Unable to process order');
        }

        if (cartItems.length === 0) {
            return res.status(400).send('No items in cart');
        }

        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // Insert order into the orders table
        db.query(
            'INSERT INTO orders (user_id, total_price, status, created_at, delivery_address, payment_method) VALUES (?, ?, ?, NOW(), ?, ?)',
            [userId, totalPrice, 'Pending', deliveryAddress, paymentMethod],
            (error, result) => {
                if (error) {
                    console.error('Error creating order:', error);
                    return res.status(500).send('Unable to create order');
                }

                const orderId = result.insertId; // Get the order_id of the inserted order

                // Loop through the cart items to insert them into the order_items table
                cartItems.forEach(item => {
                    // Fetch the picture (image_url) for the product from the products table
                    db.query('SELECT picture FROM products WHERE id = ?', [item.product_id], (error, productResults) => {
                        if (error) {
                            console.error('Error fetching product picture:', error);
                            return res.status(500).send('Unable to fetch product picture');
                        }

                        const productPicture = productResults[0]?.picture; // Get the picture URL from the products table

                        // Insert the order item into the order_items table
                        db.query(
                            'INSERT INTO order_items (order_id, product_id, product_name, quantity, price, picture) VALUES (?, ?, ?, ?, ?, ?)',
                            [orderId, item.product_id, item.product_name, item.quantity, item.price, productPicture], // Insert the picture here
                            (error) => {
                                if (error) {
                                    console.error('Error saving order item:', error);
                                    return res.status(500).send('Unable to save order items');
                                }
                            }
                        );
                    });
                });

                // Clear cart after successful checkout
                db.query('DELETE FROM cart WHERE user_id = ?', [userId], (error) => {
                    if (error) {
                        console.error('Error clearing cart:', error);
                        return res.status(500).send('Unable to clear cart');
                    }

                    // Redirect to the "My Orders" page or an order confirmation page
                    res.redirect('/orders');
                });
            }
        );
    });
});


router.get('/orders', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login'); // Redirect to login if the user is not authenticated
    }

    // Fetch user's orders along with their items
    db.query(
        'SELECT o.id as order_id, o.total_price, o.status, o.created_at, o.delivery_address, oi.product_id, oi.product_name, oi.quantity, oi.price, oi.picture ' +
        'FROM orders o ' +
        'JOIN order_items oi ON o.id = oi.order_id ' +
        'WHERE o.user_id = ? ORDER BY o.created_at DESC', 
        [userId], (error, results) => {
            if (error) {
                console.error('Error fetching orders and items:', error);
                return res.status(500).send('Unable to fetch orders');
            }

            // Group order items by order_id
            const orders = [];
            results.forEach(row => {
                const order = orders.find(order => order.order_id === row.order_id);
                if (!order) {
                    orders.push({
                        order_id: row.order_id,
                        total_price: row.total_price,
                        status: row.status,
                        created_at: row.created_at,
                        delivery_address: row.delivery_address,
                        items: [{
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            price: row.price,
                            picture: row.picture
                        }]
                    });
                } else {
                    order.items.push({
                        product_id: row.product_id,
                        product_name: row.product_name,
                        quantity: row.quantity,
                        price: row.price,
                        picture: row.picture
                    });
                }
            });

            res.render('orders', { orders }); // Pass the orders data to the view
        }
    );
});



module.exports = router;
