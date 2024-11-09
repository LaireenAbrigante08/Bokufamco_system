const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');
const db = require('./config/db'); // Ensure your database connection is correctly set up in db.js

// Importing Routes
const authRoutes = require('./routes/authRoutes');
const loansRoutes = require('./routes/loansRoutes');
const farmSuppliesRoutes = require('./routes/farmSuppliesRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');
const bodyParser = require('body-parser'); 
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Laireen', // Replace 'Laireen' with a secure, random secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set true for HTTPS connections
}));

// Serve static files and set up view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root route redirecting to landing page
app.get('/', (req, res) => {
    res.redirect('/landing');
});

// Home route
app.get('/home', (req, res) => {
    res.render('home'); // Assuming you have a home.ejs file
});

// Members route (render user information)
app.get('/members', (req, res) => {
    // Fetch user data from session
    const user = req.session.user; 
    const successMessage = req.session.successMessage || null; // Get success message from session
    delete req.session.successMessage; // Clear the success message after displaying it

    if (user) {
        res.render('memberInformation', { user, successMessage });
    } else {
        // Redirect to login page if no session is found
        res.redirect('/memberInformation');
    }
});


// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Routes
app.use('/', authRoutes);
app.use('/loans', loansRoutes);
app.use('/farm-supplies', farmSuppliesRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/members', memberRoutes(db));
app.use('/admin', adminRoutes); // Admin routes without isAdmin here

// Start the server
app.listen(9000, () => console.log('Server running on http://localhost:9000'));