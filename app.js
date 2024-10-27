const express = require('express');
const session = require('express-session');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Import contact routes
const aboutRoutes = require('./routes/aboutRoutes'); // Import about routes
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
}));

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

// Use the authentication, contact, and about routes
app.use('/', authRoutes);
app.use('/', contactRoutes); // Use contact routes
app.use('/', aboutRoutes); // Use about routes

// Start the server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
