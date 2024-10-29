const Equipment = require('../models/Equipment');

exports.getEquipment = async (req, res) => {
    try {
        let equipment;
        if (req.isAuthenticated()) { // Check if the user is authenticated
            equipment = await Equipment.getUserEquipment(); // Get equipment for logged-in user
        } else {
            equipment = await Equipment.getAllEquipment(); // Get all equipment for guests
        }
        res.render('equipment-rentals', { equipment }); // Render the equipmentRentals.ejs view with equipment data
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
