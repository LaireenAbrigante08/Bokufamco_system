const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db'); // Ensure your database connection is correctly set up in db.js
const flash = require('connect-flash');

// Importing Routes
const authRoutes = require('./routes/authRoutes');
const loansRoutes = require('./routes/loansRoutes');
const farmSuppliesRoutes = require('./routes/farmSuppliesRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');
const cartRoutes = require('./routes/cartRoutes');  
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
//app.use(bodyParser.json()); // Parses incoming JSON payloads

// Session management
app.use(session({
    secret: 'your-secret-key',  // A secret key for signing the session ID cookie
    resave: false,              // Don't save session if unmodified
    saveUninitialized: true,    // Save session even if it's not modified
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7  // Set session expiration to 7 days (7 days * 24 hours * 60 minutes * 60 seconds)
    }
  }));

app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});


// Serve static files (CSS, images, etc.) and set up the view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('views', './views'); // Ensure views are stored in the `views` folder

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
    const userName = req.session.user ? req.session.user.username : 'Guest'; // Example: get username from session
    res.render('admin', { userName });
});

// Admin route to approve a member
app.post('/admin/approve-member/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'UPDATE members SET status = ? WHERE user_id = ?';
    
    // Use db.query instead of connection.query
    db.query(query, ['approved', userId], (err, result) => {
        if (err) {
            return res.status(500).send('Error updating member status');
        }
        res.send({ success: true });
    });
});

// Admin route to display members for approval
app.get('/admin/member', (req, res) => {
    const query = 'SELECT * FROM members';
    
    // Use db.query instead of connection.query
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching members');
        }
        
        // Pass members data to the view
        res.render('admin/member', { members: results });
    });
});



app.get('/admin/memberProfile/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT * FROM members WHERE user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Database error' });
        } else {
            res.json(results[0]);  // Return the member's profile data as JSON
        }
    });
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
app.use('/', equipmentRoutes);
app.use('/members', memberRoutes);
app.use('/admin', adminRoutes); // Admin routes without isAdmin here
app.use('/', cartRoutes);  // Use the routes in the application



// Start the server
app.listen(3003, () => console.log('Server running on http://localhost:3003'));
