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
app.use(express.json()); // For parsing application/json

// Session management
app.use(session({
    secret: 'your-secret-key',  // A secret key for signing the session ID cookie
    resave: false,              // Don't save session if unmodified
    saveUninitialized: true,    // Save session even if it's not modified
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7  // Set session expiration to 7 days (7 days * 24 hours * 60 minutes * 60 seconds)
    }
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

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
    const userName = req.session.user ? req.session.user.username : 'Guest'; // Example: get username from session
    res.render('admin', { userName });
});

// Admin route to approve a member
app.post('/admin/approve-member/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'UPDATE members SET status = ? WHERE user_id = ?';
    
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
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching members');
        }
        
        res.render('admin/member', { members: results });
    });
});

// Admin route to fetch rentals with equipment names
app.get('/admin/rentals', (req, res) => {
    const sql = `
        SELECT rentals.*, equipment.name AS equipment_name
        FROM rentals
        INNER JOIN equipment ON rentals.equipment_id = equipment.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching rentals data:', err);
            return res.status(500).send('Error fetching rentals data');
        }
        res.render('admin/rentals', { rentals: results });
    });
});

// Route to handle rental status updates (canceling a rental)
app.post('/admin/rentals/cancel/:id', (req, res) => {
    const rentalId = req.params.id;
    
    // Check if the rental status is already canceled
    const checkSql = `SELECT rental_status FROM rentals WHERE id = ?`;
    db.query(checkSql, [rentalId], (err, results) => {
        if (err) {
            console.error('Error checking rental status:', err);
            return res.status(500).send('Error checking rental status');
        }

        if (results[0].rental_status === 'Canceled') {
            return res.status(400).send('Rental is already canceled');
        }

        // Proceed with the status update if not canceled yet
        const sql = `UPDATE rentals SET rental_status = 'Canceled' WHERE id = ?`;

        db.query(sql, [rentalId], (err) => {
            if (err) {
                console.error('Error canceling rental:', err);
                return res.status(500).send('Error canceling rental');
            }

            res.redirect('/admin/rentals');
        });
    });
});

// Route to handle rental status updates (marking rental as returned)
app.post('/admin/rentals/mark-returned/:id', (req, res) => {
    const rentalId = req.params.id;
    
    // Check if the rental status is already returned
    const checkSql = `SELECT rental_status FROM rentals WHERE id = ?`;
    db.query(checkSql, [rentalId], (err, results) => {
        if (err) {
            console.error('Error checking rental status:', err);
            return res.status(500).send('Error checking rental status');
        }

        if (results[0].rental_status === 'Returned') {
            return res.status(400).send('Rental is already returned');
        }

        // Proceed with the status update if not returned yet
        const sql = `UPDATE rentals SET rental_status = 'Returned' WHERE id = ?`;

        db.query(sql, [rentalId], (err) => {
            if (err) {
                console.error('Error marking rental as returned:', err);
                return res.status(500).send('Error marking rental as returned');
            }

            res.redirect('/admin/rentals');
        });
    });
});

// Admin route for member profile (viewing and editing member info)
app.get('/admin/memberProfile/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT * FROM members WHERE user_id = ?`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching member profile:', err);
            return res.status(500).send('Error fetching member profile');
        }

        res.render('admin/memberProfile', { member: results[0] });
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
app.use('/admin', adminRoutes);
app.use('/', cartRoutes);

// Start the server
app.listen(3003, () => console.log('Server running on http://localhost:3003'));
