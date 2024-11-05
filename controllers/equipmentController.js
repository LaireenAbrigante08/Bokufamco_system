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

// Handle adding equipment
exports.addEquipment = async (req, res) => {
    const { name, description, rentalPrice, available } = req.body; // Get data from form
    const picture = req.file ? req.file.filename : null; // Handle file upload
    try {
        console.log({ name, description, rentalPrice, available }); // Log the incoming data
        await Equipment.addEquipment(name, description, picture, rentalPrice, available === 'on' ? "Yes" : "No");
        res.redirect('/admin/equipment'); // Redirect after successful addition
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding equipment");
    }
};

// Show edit equipment form
exports.getEditEquipmentForm = async (req, res) => {
    try {
        const equipment = await Equipment.getEquipmentById(req.params.id);
        res.render('admin/edit-equipment', { equipment });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading edit form");
    }
};

// Handle updating equipment
exports.updateEquipment = async (req, res) => {
    const { name, description, rentalPrice, available } = req.body;
    const picture = req.file ? req.file.filename : req.body.currentPicture; // Handle picture
    try {
        console.log({ id: req.params.id, name, description, rentalPrice, available }); // Log incoming data
        await Equipment.updateEquipment(req.params.id, name, description, picture, rentalPrice, available === 'on' ? "Yes" : "No");
        res.redirect('/admin/equipment');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating equipment");
    }
};

// Handle deleting equipment
exports.deleteEquipment = async (req, res) => {
    try {
        await Equipment.deleteEquipment(req.params.id);
        res.redirect('/admin/equipment');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting equipment");
    }
};
