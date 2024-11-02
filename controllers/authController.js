const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
    const { username, email, password, role = "user" } = req.body; // Set role as 'user' by default
    try {
        await User.createUser(username, email, password, role); // Pass role to createUser
        res.redirect('/login');
    } catch (err) {
        console.error("Error during registration:", err); // Log error details
        res.status(500).send('Error during registration');
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findUserByUsername(username); // Retrieve user from database
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/home'); // Redirect to the homepage if login is successful
        } else {
            res.send('Invalid credentials'); // Show error if username or password is incorrect
        }
    } catch (err) {
        console.error("Error during login:", err); // Log detailed error
        res.status(500).send('Error during login');
    }
};




exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error during logout');
        res.redirect('/login');
    });
};
