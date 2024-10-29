const Product = require('../models/Product');

exports.getFarmSupplies = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        res.render('farm-supplies', { products }); // Render the farm-supplies.ejs view with products data
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
