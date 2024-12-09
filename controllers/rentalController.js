const rentalModel = require('../models/rentalModel');

// Render the rent form for a specific equipment item
const renderRentForm = (req, res) => {
    const equipmentId = req.params.id;

    // Fetch the equipment details from the database
    rentalModel.getEquipmentById(equipmentId, (err, equipment) => {
        if (err) {
            return res.status(500).send('Error fetching equipment details');
        }

        // Render the rent form view with equipment details
        res.render('equipment/rent-form', { equipment });
    });
};

// Submit the rental form (save rental info to the database)
const submitRentalForm = (req, res) => {
    const { start_date, end_date, payment_method, payment_amount } = req.body;
    const equipmentId = req.params.id;
    const userId = req.user.id; // Assuming user is authenticated

    // Validate the input
    if (!start_date || !end_date || !payment_method || !payment_amount) {
        return res.status(400).send('All fields are required.');
    }

    // Save the rental data to the database
    rentalModel.saveRental(equipmentId, userId, start_date, end_date, payment_method, payment_amount, (err, result) => {
        if (err) {
            return res.status(500).send('Error processing rental.');
        }

        // Redirect to a success page or show rental confirmation
        res.redirect(`/equipment/${equipmentId}/rental-success`);
    });
};

module.exports = {
    renderRentForm,
    submitRentalForm
};
