const express = require('express');
const session = require('express-session');
const path = require('path'); // Import path
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Import contact routes
const aboutRoutes = require('./routes/aboutRoutes'); // Import about routes
const app = express();

// Import other routes
const loansRoutes = require('./routes/loansRoutes');
const farmSuppliesRoutes = require('./routes/farmSuppliesRoutes');
const equipmentRentalsRoutes = require('./routes/equipmentRentalsRoutes');
const memberInformationRoutes = require('./routes/memberInformationRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes'); // New purchase route
// Removed adminRoutes as it is now included in authRoutes

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Root route redirecting to landing
app.get('/', (req, res) => {
    res.redirect('/landing');
});

// Homepage route
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { username: req.session.user.username }); // Pass the username to the view
    } else {
        res.redirect('/login'); // Redirect to login if not logged in
    }
});

// Middleware to check for admin privileges
function isAdmin(req, res, next) {
    // Check if the user is logged in and has admin privileges
    if (req.session.user && req.session.user.role === 'admin') { // Change from isAdmin to role check
        return next();
    }
    // If not admin, redirect to the user home page
    res.redirect('/home');
}

// Admin Dashboard route
app.get('/adminDashboard', isAdmin, (req, res) => {
    res.render('adminDashboard');
});

// Registration route
app.get('/register', (req, res) => {
    res.render('register'); // Render the register page
});

// Use the authentication, contact, and about routes
app.use('/', authRoutes);
app.use('/', contactRoutes); // Use contact routes
app.use('/', aboutRoutes); // Use about routes
app.use('/loans', loansRoutes);
app.use('/farm-supplies', farmSuppliesRoutes);
app.use('/equipment-rentals', equipmentRentalsRoutes);
app.use('/member-information', memberInformationRoutes);
app.use('/purchase', purchaseRoutes); // Use the purchase route
// Ensure member information route is used correctly
app.use('/members', memberInformationRoutes);

// Start the server
app.listen(4300, () => console.log('Server running on http://localhost:4300'));
