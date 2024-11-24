const express = require('express');
const router = express.Router();
const { purchaseProduct } = require('../controllers/productController');
const isAuthenticated = require('../Middleware/auth');
const { getUserOrders } = require('../controllers/productController');

router.post('/purchase/:productId',isAuthenticated,  purchaseProduct);

router.get('/orders', isAuthenticated, getUserOrders);

module.exports = router;
