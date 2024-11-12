const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Ensure your database connection is correctly set up in db.js

// Importing Routes
const authRoutes = require('./routes/authRoutes');
const loansRoutes = require('./routes/loansRoutes');
const farmSuppliesRoutes = require('./routes/farmSuppliesRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(bodyParser.json()); // Parses incoming JSON payloads

// Session management
app.use(session({
    secret: 'Laireen', // Use a secure, random secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
}));

// Serve static files (CSS, images, etc.) and set up the view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Root route redirects to the landing page
app.get('/', (req, res) => {
    res.redirect('/landing');
});

// Home route for the logged-in user
app.get('/home', (req, res) => {
    res.render('home'); // Render the home.ejs file
});


// Member information route (render user information)
app.get('/members', (req, res) => {
    const user = req.session.user; 
    const successMessage = req.session.successMessage || null; // Fetch success message from session
    delete req.session.successMessage; // Clear the success message after displaying it

    if (user) {
        res.render('memberInformation', { user, successMessage });
    } else {
        res.redirect('/login'); // Redirect to login page if no user is logged in
    }
});
app.post('/members/update', (req, res) => {
    const { user_id, first_name, middle_name, last_name, address, dob, email, gender, contact_number } = req.body;

    db.query(
        'UPDATE members SET first_name = ?, middle_name = ?, last_name = ?, address = ?, dob = ?, email = ?, gender = ?, contact_number = ? WHERE user_id = ?',
        [first_name, middle_name, last_name, address, dob, email, gender, contact_number, user_id],
        (err, result) => {
            if (err) {
                console.error("Database update error:", err);
                return res.status(500).send('Error updating member information');
            }
            req.session.successMessage = 'Member information updated successfully!';
            res.status(200).json({ message: 'Member information updated' }); // Respond with JSON for AJAX
        }
    );
});


// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Routes
app.use('/', authRoutes); // Authentication-related routes
app.use('/loans', loansRoutes); // Loan-related routes
app.use('/farm-supplies', farmSuppliesRoutes); // Farm supplies-related routes
app.use('/equipment', equipmentRoutes); // Equipment-related routes
app.use('/purchase', purchaseRoutes); // Purchase-related routes

// Member-related routes, passing db for database interaction
app.use('/members', memberRoutes(db));

// Admin routes with session validation for 'Admin' role
app.use('/admin', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Admin') {
        return next(); // Allow access to admin routes
    }
    return res.status(403).send('Access denied'); // Forbidden if not admin
}, adminRoutes);

// Fallback route for undefined routes (404)
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(9000, () => {
    console.log('Server running on http://localhost:9000');
});
