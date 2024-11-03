const Equipment = require('../models/Equipment');

exports.getEquipment = async (req, res) => {
    try {
        let equipment;
        if (req.isAuthenticated()) { // Check if the user is authenticated
            equipment = await Equipment.getUserEquipment(); // Get equipment for logged-in user
        } else {
            equipment = await Equipment.getAllEquipment(); // Get all equipment for guests
        }
        
        // Render the equipment-rentals view with equipment data and authentication status
        res.render('equipment-rentals', { equipment, isAuthenticated: req.isAuthenticated() });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
