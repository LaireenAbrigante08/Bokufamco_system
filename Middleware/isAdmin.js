// middleware/isAdmin.js
function isAdmin(req, res, next) {
    const maxInactivity = 1000 * 60 * 10; // 10 minutes in milliseconds
    const now = Date.now();

    // Check if the user is logged in and an admin
    if (req.session.user && req.session.user.role === 'Admin') {
        // Check for inactivity timeout
        if (req.session.lastActivity && now - req.session.lastActivity > maxInactivity) {
            // Destroy session if inactive for too long
            req.session.destroy(err => {
                if (err) {
                    console.error('Session destroy error:', err);
                }
                return res.redirect('/login'); // Redirect to login page
            });
        } else {
            // Update the last activity time to prolong session
            req.session.lastActivity = now;
            return next();
        }
    } else {
        // Redirect to login if the user is not an admin
        return res.redirect('/login');
    }
}

module.exports = { isAdmin };
