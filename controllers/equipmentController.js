const Equipment = require('../models/Equipment'); // Ensure this path matches your folder structure

// Get all equipment for display
exports.getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.getAllEquipment(); // Get all equipment
        const isAuthenticated = req.session && req.session.userId; // Check if user is logged in
        res.render('equipment', { equipment, isAuthenticated }); // Render view
    } catch (error) {
        console.error('Error in getEquipment:', error);
        res.status(500).send('Server Error');
    }
};

// Admin function to get all equipment for management
exports.getAllEquipment = async (req, res) => {
    try {
        const equipmentList = await Equipment.getAllEquipment();
        console.log('Fetched Equipment List:', equipmentList); // Log fetched data
        res.render('admin/equipment', { equipmentList });
    } catch (error) {
        console.error('Error loading equipment list:', error); // Log error
        res.status(500).send("Error loading equipment list");
    }
};

// Show add equipment form
exports.getAddEquipmentForm = (req, res) => {
    res.render('admin/add-equipment');
};

exports.addEquipment = async (req, res) => {
    const { name, description, price, stock_quantity, status } = req.body; // Use 'stock_quantity'
    const picture = req.file ? req.file.filename : null; // Handle file upload

    try {
        console.log({ name, description, price, stock_quantity, status, picture });

        // Validate 'price'
        if (!price || isNaN(price)) {
            return res.status(400).send('Price must be a valid number');
        }

        // Validate 'stock_quantity'
        const parsedStockQuantity = stock_quantity && !isNaN(stock_quantity) ? parseInt(stock_quantity) : null;
        if (parsedStockQuantity === null || parsedStockQuantity < 0) {
            return res.status(400).send('Stock quantity must be a valid, non-negative number');
        }

        // Insert new equipment into the database
        await Equipment.addEquipment(
            name,
            description,
            picture,
            parseFloat(price),
            parsedStockQuantity, // Use parsed stock_quantity
            status === 'Available' ? 'Available' : 'Not Available'
        );

        res.redirect('/admin'); // Redirect after successful addition
    } catch (error) {
        console.error('Error adding equipment:', error.message);
        res.status(500).send('An error occurred while adding the equipment. Please try again.');
    }
};

// Show edit equipment form
exports.getEditEquipmentForm = async (req, res) => {
    try {
        const equipment = await Equipment.getEquipmentById(req.params.id);
        if (!equipment) {
            return res.status(404).send("Equipment not found");
        }
        res.render('admin/edit-equipment', { equipment });
    } catch (error) {
        console.error("Error loading edit form:", error);
        res.status(500).send("Error loading edit form");
    }
};

// Handle updating equipment
exports.updateEquipment = async (req, res) => {
    const { name, description, price, stockQuantity, status } = req.body;
    const picture = req.file ? req.file.filename : req.body.currentPicture;

    // Log incoming data for debugging
    console.log('Received Data:', {
        id: req.params.id,
        name,
        description,
        price,
        stockQuantity,
        status,
        picture
    });

    try {
        // Validate inputs
        if (!name || !description || !price || !stockQuantity || !status) {
            return res.status(400).send('All fields are required.');
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).send('Price must be a valid positive number.');
        }
        if (isNaN(stockQuantity) || stockQuantity < 0) {
            return res.status(400).send('Stock Quantity must be a valid non-negative number.');
        }

        // Convert stockQuantity to a number to ensure correct formatting
        const stockQty = parseInt(stockQuantity, 10);

        // Update equipment in the database
        await Equipment.updateEquipment(req.params.id, {
            name,
            description,
            picture,
            price,
            stockQuantity: stockQty,  // Ensure it's a number
            status
        });

        // Redirect to equipment list page
        res.redirect('/admin');
    } catch (error) {
        console.error("Error updating equipment:", error);
        res.status(500).send("Error updating equipment.");
    }
};


// Handle deleting equipment
exports.deleteEquipment = async (req, res) => {
    try {
        await Equipment.deleteEquipment(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting equipment");
    }
};

// controllers/equipmentController.js
exports.rentEquipment = async (req, res) => {
    const equipmentId = req.params.id;

    try {
        const [equipment] = await db.query('SELECT * FROM equipment WHERE id = ?', [equipmentId]);

        if (!equipment.length) {
            return res.status(404).send('Equipment not found');
        }

        res.render('rentEquipment', { equipment: equipment[0] }); // Render rent page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


