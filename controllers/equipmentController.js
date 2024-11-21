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
  const { name, description, price, stockQuantity, status } = req.body; // Get data from form
  const picture = req.file ? req.file.filename : null; // Handle file upload
  try {
      // Log the incoming data for debugging
      console.log({ name, description, price, stockQuantity, status, picture }); 
      
      // Make sure 'price' is provided and not null
      if (!price || isNaN(price)) {
          return res.status(400).send('Price must be a valid number');
      }

      // Insert new equipment into the database
      await Equipment.addEquipment(name, description, picture, price, stockQuantity, status === 'on' ? 'Available' : 'Not Available');
      
      // After successful addition, fetch all equipment to display on the same page
      const equipmentList = await Equipment.getAllEquipment();


      
      // Render the admin page with the updated equipment list
      res.redirect('/admin'); // Redirect to the dashboard after update
    } catch (error) {
        console.error("Error updating member:", error.message);
        res.status(500).send("An error occurred while updating the member profile. Please try again.");
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
    const { name, description, price, stockQuantity, status } = req.body;
    const picture = req.file ? req.file.filename : req.body.currentPicture; // Handle picture
    try {
        // Log incoming data for debugging
        console.log({ id: req.params.id, name, description, price, stockQuantity, status, picture });

        // Validate price
        if (!price || isNaN(price)) {
            return res.status(400).send('Price must be a valid number');
        }

        // Update equipment in the database
        await Equipment.updateEquipment(req.params.id, name, description, picture, price, stockQuantity, status === 'on' ? 'Available' : 'Not Available');
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
