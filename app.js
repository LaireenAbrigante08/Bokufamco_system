const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db'); // Ensure your database connection is correctly set up in db.js

// Importing Routes
const authRoutes = require('./routes/authRoutes');
const loansRoutes = require('./routes/loansRoutes');
const farmSuppliesRoutes = require('./routes/farmSuppliesRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const memberInformationRoutes = require('./routes/memberInformationRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Laireen', // Replace 'Laireen' with a secure, random secret key
    resave: false,
    saveUninitialized: false,
}));

// Serve static files and set up view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Root route redirecting to landing page
app.get('/', (req, res) => {
    res.redirect('/landing');
});

app.get('/home', (req, res) => {
    res.render('home'); // Assumes home.ejs exists in the views folder
});

// Middleware to check for admin privileges
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'Admin') {
        return next();
    }
    res.redirect('/home');
}

// Routes
app.use('/', authRoutes);                   // Authentication routes
app.use('/loans', loansRoutes);              // Loans routes
app.use('/farm-supplies', farmSuppliesRoutes); // Farm Supplies routes
app.use('/equipment', equipmentRoutes);      // Equipment routes
app.use('/members', memberInformationRoutes); // Member Information routes
app.use('/purchase', purchaseRoutes);        // Purchase routes
app.use('/adminDashboard', adminRoutes);     // Admin Dashboard routes

// Example of using isAdmin middleware on a route (Admin-specific routes)
app.get('/admin', isAdmin, (req, res) => {
    res.render('adminDashboard'); // Render adminDashboard.ejs for admin users
});


// Start the server
app.listen(2300, () => console.log('Server running on http://localhost:2300'));
