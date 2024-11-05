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
const bodyParser = require('body-parser'); 
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
app.use(express.urlencoded({ extended: true })); // for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Root route redirecting to landing page
app.get('/', (req, res) => {
    res.redirect('/landing');
});

app.get('/home', (req, res) => {
    res.render('home'); // Assuming you have a home.ejs file
});

// Routes
app.use('/', authRoutes);
app.use('/loans', loansRoutes);
app.use('/farm-supplies', farmSuppliesRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/members', memberInformationRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/admin', adminRoutes); // Admin routes without isAdmin here


// Start the server
app.listen(4003, () => console.log('Server running on http://localhost:4003'));
