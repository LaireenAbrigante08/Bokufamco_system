const express = require('express');
const session = require('express-session');
const path = require('path'); // Import path
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Import contact routes
const aboutRoutes = require('./routes/aboutRoutes'); // Import about routes
const app = express();

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

// Root route redirecting to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Homepage route
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { username: req.session.user.username }); // Pass the username to the view
    } else {
        res.redirect('/login'); // Redirect to login if not logged in
    }
});

// Registration route
app.get('/register', (req, res) => {
    res.render('register'); // Render the register page
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Add logic here to handle registration (e.g., save user to the database)
    res.send('User registered'); // Temporary response for testing
});

// Use the authentication, contact, and about routes
app.use('/', authRoutes);
app.use('/', contactRoutes); // Use contact routes
app.use('/', aboutRoutes); // Use about routes

// Start the server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
