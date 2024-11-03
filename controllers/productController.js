const Product = require('../models/Product');

exports.getFarmSupplies = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        const isAuthenticated = req.session && req.session.userId; // Check if user is logged in
        res.render('farm-supplies', { products, isAuthenticated }); // Pass isAuthenticated instead of req
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};



