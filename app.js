const express = require('express');
const session = require('express-session');
const path = require('path');
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

app.get('/admin/member-profile/:userId', (req, res) => {
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


app.post('/update-member', async (req, res) => {
    const { user_id, email, first_name, middle_name, last_name, address, dob, gender, contact_number } = req.body;

    console.log('Form data received:', req.body);  // Log to see the incoming form data

    // Ensure the user_id is passed correctly
    if (!user_id) {
        return res.status(400).send("User ID is missing. Please complete your profile.");
    }

    try {
        // Debugging log for user_id
        console.log('Updating member with user_id:', user_id);

        // Use promise-based query to update the member information
        const [rows, fields] = await db.promise().query(
            `UPDATE members SET email = ?, first_name = ?, middle_name = ?, last_name = ?, address = ?, dob = ?, gender = ?, contact_number = ? WHERE user_id = ?`,
            [email, first_name, middle_name, last_name, address, dob, gender, contact_number, user_id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).send("Member not found or no changes made.");
        }

        // Successfully updated, redirect to the home page or profile page
        res.redirect('/home');
    } catch (error) {
        console.error("Error updating member:", error.message);
        res.status(500).send("An error occurred while updating the member profile. Please try again.");
    }
});


const Equipment = require('./models/Equipment');

app.get('/equipment/:id', (req, res) => {
    const equipmentId = req.params.id;

    if (!req.session.userId || !req.session.memberId) {
        return res.status(400).send('User or Member ID is missing. Please complete your profile.');
    }

    Equipment.getEquipmentById(equipmentId)
        .then(equipment => {
            res.render('rentEquipment', {
                equipment,
                userId: req.session.userId,
                memberId: req.session.memberId,
            });
        })
        .catch(err => {
            console.error('Error fetching equipment:', err);
            res.status(500).send('Error fetching equipment');
        });
});


app.get('/admin/view-member/:userId', (req, res) => {
    const userId = req.params.userId;

    // Fetch member details from the database
    db.query('SELECT * FROM members WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).send("Error fetching member details.");
        }

        if (results.length > 0) {
            const memberData = results[0]; // Get the first result (single member)
            res.render('admin/view-member', { member: memberData }); // Render the profile page with member data
        } else {
            res.status(404).send("Member not found.");
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
app.use('/equipment', equipmentRoutes);
app.use('/members', memberRoutes);
app.use('/admin', adminRoutes); // Admin routes without isAdmin here
app.use('/', purchaseRoutes);
app.use('/purchase', purchaseRoutes);



// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
