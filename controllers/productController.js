const Order = require('../models/Order');
const Product = require('../models/Product');
exports.getUserOrders = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        const orders = await Order.findByUserId(userId);
        res.render('orders', { orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.purchaseProduct = async (req, res) => {
    const userId = req.session.userId; // Assume user session stores their ID
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Reduce product stock
        const updatedStock = await Product.reduceStock(productId, quantity);
        if (!updatedStock) {
            return res.status(400).json({ message: 'Unable to process purchase' });
        }

        // Calculate total price
        const totalPrice = product.price * quantity;

        // Create an order
        await Order.createOrder({
            userId,
            productId,
            quantity,
            totalPrice,
            status,
        });

        // Redirect to orders page
        res.redirect('/home');
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get products for user view
exports.getFarmSupplies = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        const isAuthenticated = req.session && req.session.userId;
        res.render('farm-supplies', { products, isAuthenticated });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server Error');
    }
};

// Render Add Product Form
exports.getAddProductForm = (req, res) => {
    console.log('GET /admin/farm-supplies/add called');
    res.render('admin/add-product');
};

// Get products for admin view
exports.getAdminFarmSupplies = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        const isAuthenticated = req.session && req.session.userId;
        res.render('admin/farm-supplies', { products, isAuthenticated });
    } catch (error) {
        console.error('Error fetching products for admin:', error);
        res.status(500).send('Server Error');
    }
};

// Add new product
exports.addProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    const picture = req.file.filename; // Get the uploaded file name
    try {
        await Product.addProduct({ name, description, picture, price, stock });
        res.redirect('/admin/farm-supplies');
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Error adding product');
    }
};

// Render Edit Product Form
exports.showEditProductForm = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('admin/edit-product', { product });
    } catch (error) {
        console.error('Error fetching product for edit:', error);
        res.status(500).send('Server error');
    }
};

// Update product details
exports.updateProduct = async (req, res) => {
    console.log('Received POST request for update product');
    const productId = req.params.id;
    const { name, description, price, stock } = req.body;
    const picture = req.file ? req.file.filename : undefined;

    try {
        console.log('Updating product:', { productId, name, description, price, stock, picture });
        await Product.updateProduct(productId, { name, description, picture, price, stock });
        res.redirect('/admin/farm-supplies');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
};


// Delete product
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        await Product.deleteProduct(productId);
        res.redirect('/admin/farm-supplies');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
};
