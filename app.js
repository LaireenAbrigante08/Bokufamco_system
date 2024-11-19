const express = require('express');
const session = require('express-session');
const path = require('path');
//const mysql = require('mysql2');
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
//app.use(bodyParser.json()); // Parses incoming JSON payloads

// Session management
app.use(session({
    secret: 'Laireenkdjnsvjwehukfhwl', // Replace 'Laireen' with a secure, random secret key
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
    const userName = req.session.user?.username || 'User'; // Fetch username from session or default to 'User'
    res.render('home', { userName });
});

// Example route in authRoutes.js
app.get('/admin', (req, res) => {
    // Assuming you have the user data stored in the session or can retrieve it from the database
    const userName = req.session.user ? req.session.user.username : 'Guest'; // Example: get username from session

    // Render the admin page and pass userName to the template
    res.render('admin', { userName });
});

app.get('/member-profile', (req, res) => {
    const userId = req.session.user?.id; // Get the logged-in user's ID from the session

    if (!userId) {
        return res.redirect('/login'); // Redirect to login if the user is not logged in
    }

    // Fetch member information from the database
    db.query('SELECT * FROM members WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving member information');
        }

        // Check if member data exists
        const member = results[0];
        if (!member) {
            return res.render('member-form', { member: null, message: 'No member information found' });
        }

        // Pass the member data to the EJS template
        res.render('member-form', { member, message: null });
    });
});

app.post('/update-member', async (req, res) => {
    const { user_id, email, first_name, middle_name, last_name, address, dob, gender, contact_number } = req.body;

    try {
        // Ensure the user_id is passed correctly
        if (!user_id) {
            return res.status(400).send("User ID is required.");
        }

        console.log('Updating member with user_id:', user_id);  // Debugging log
        console.log('Form data received:', req.body);  // Debugging log

        // Use promise-based query
        const [rows, fields] = await db.promise().query(
            `UPDATE members SET email = ?, first_name = ?, middle_name = ?, last_name = ?, address = ?, dob = ?, gender = ?, contact_number = ? WHERE user_id = ?`,
            [email, first_name, middle_name, last_name, address, dob, gender, contact_number, user_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).send("Member not found or no changes made.");
        }

        res.redirect('/home'); // Redirect to the dashboard after update
    } catch (error) {
        console.error("Error updating member:", error.message);
        res.status(500).send("An error occurred while updating the member profile. Please try again.");
    }
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
app.use('/', authRoutes);
app.use('/loans', loansRoutes);
app.use('/farm-supplies', farmSuppliesRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/members', memberRoutes);
app.use('/admin', adminRoutes); // Admin routes without isAdmin here

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));