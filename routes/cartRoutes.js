const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Simulating cart data (you would normally get this from a session or a database)
const cartItems = [
    { id: 1, product_name: 'Tractor Rental', quantity: 1, price: 100, total: 100 },
    { id: 2, product_name: 'Harvester Rental', quantity: 2, price: 150, total: 300 },
];

router.get('/cart', (req, res) => {
    let totalAmount = cartItems.reduce((sum, item) => sum + (item.total || (item.price * item.quantity)), 0);
    res.render('cart', { cartItems, totalAmount });
});

router.post('/cart/remove/:id', (req, res) => {
    const itemId = req.params.id;
    // Remove the item from your cart logic here
    // After removing, redirect to the cart page to reflect changes
    res.redirect('/cart');
});

router.post('/cart/update-quantity/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
        return res.redirect('/cart'); // Optionally show an error
    }

    // Update the quantity in the database or session
    updateCartItemQuantity(id, quantity);

    // Redirect back to the cart page
    res.redirect('/cart');
});


module.exports = router;
