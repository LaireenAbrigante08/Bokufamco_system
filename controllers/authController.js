const User = require('../models/User');
const Member = require('../models/Member');
const bcrypt = require('bcryptjs');

// Define the register function
exports.register = async (req, res) => {
    const { username, email, password, role = "User", firstName, middleName, lastName, address, dob, gender, contactNumber } = req.body;
    try {
        const userResult = await User.createUser(username, email, password, role);
        const userId = userResult.insertId;
        await Member.createMember(userId, firstName, middleName, lastName, address, dob, email, gender, contactNumber);
        res.redirect('/login');
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send('Error during registration');
    }
};

// Define the login function
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findUserByUsername(username);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.user = user;
                req.session.userId = user.id;

                // Fetch the member details using the user ID
                const member = await Member.findMemberByUserId(user.id);
                if (member) {
                    console.log("User is a member");
                } else {
                    console.log("User is not a member");
                }

                // Redirect based on the user's role
                if (user.role === 'Admin') {
                    return res.redirect('/admin');
                } else {
                    return res.redirect('/home');
                }
            } else {
                return res.render('login', { error: 'Invalid credentials' });
            }
        } else {
            return res.render('login', { error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send('Error during login');
    }
};
