const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your existing mysql2 connection

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

            // Calculate the total cart value as a number
            const cartTotal = results.reduce((total, item) => total + item.total, 0);

            // Ensure cartTotal is a number before passing it to the template
            res.render('cart', { cartItems: results, cartTotal: cartTotal });
        }
    );
});
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


router.post('/cart/update-quantity/:id', (req, res) => {
    const { id } = req.params; // Cart item ID
    const { quantity } = req.body; // New quantity
    console.log('Received quantity update request:', id, quantity);

    // Validate that the quantity is a number and greater than 0
    if (isNaN(quantity) || quantity < 1) {
        console.log('Invalid quantity received:', quantity);
        return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    // Update the quantity in the cart table
    db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], (error, result) => {
        if (error) {
            console.error('Error updating cart:', error);
            return res.status(500).json({ success: false, error: 'Failed to update cart' });
        }
        
        // After updating, get the updated cart total
        db.query('SELECT * FROM cart WHERE user_id = ?', [req.user.id], (error, cartItems) => {
            if (error) {
                console.error('Error fetching cart items:', error);
                return res.status(500).json({ success: false, error: 'Failed to fetch cart items' });
            }

            const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            console.log('Updated cart total:', cartTotal);
            res.json({ success: true, cartTotal });
        });
    });
});

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

        // Check if the stock is sufficient
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

                        res.redirect('/cart'); // Redirect to the cart page after adding
                    }
                );
            }
        );
    });
});

module.exports = router;
