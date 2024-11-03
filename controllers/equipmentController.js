const Equipment = require('../models/Equipment'); // Ensure this path matches your folder structure

exports.getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.getAllEquipment(); // Get all equipment for both logged in and guest users
        const isAuthenticated = req.session && req.session.userId; // Check if user is logged in

        // Render the equipment view with equipment data and authentication status
        res.render('equipment', { equipment, isAuthenticated });
    } catch (error) {
        console.error('Error in getEquipment:', error);
        res.status(500).send('Server Error');
    }
};
