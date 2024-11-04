const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
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
    secret: 'Laireen',
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

app.get('/home', (req, res) => {
    res.render('home'); // Assuming you have a home.ejs file
});

// Middleware to check for admin privileges
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'Admin') {
        return next();
    }
    res.redirect('/home');
}

// Routes
app.use('/', authRoutes);
app.use('/loans', loansRoutes);
app.use('/farm-supplies', farmSuppliesRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/members', memberInformationRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/adminDashboard', adminRoutes);

// Example of using isAdmin middleware on a route (Admin-specific routes)
app.get('/admin', isAdmin, (req, res) => {
    res.render('adminDashboard'); // Replace with your actual admin dashboard view
});

// Start the server
app.listen(2300, () => console.log('Server running on http://localhost:2300'));
