const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, email, password, role = "user" } = req.body; // Set role as 'user' by default
    try {
        await User.createUser(username, email, password, role); // Pass role to createUser
        res.redirect('/login');
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send('Error during registration');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findUserByUsername(username); // Retrieve user from database

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password); // Compare entered password with hashed password
            
            if (isMatch) {
                req.session.user = user; // Store user info in session
                
                // Check user role and redirect accordingly
                if (user.role === 'admin') {
                    return res.redirect('/adminDashboard'); // Redirect admin to admin dashboard
                } else {
                    return res.redirect('/home'); // Redirect regular user to homepage
                }
            } else {
                console.log("Invalid credentials - Password mismatch");
                return res.send('Invalid credentials'); // Password does not match
            }
        } else {
            console.log("Invalid credentials - User not found");
            return res.send('Invalid credentials'); // User not found
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send('Error during login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error during logout');
        res.redirect('/login');
    });
};
