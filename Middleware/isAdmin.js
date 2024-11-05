// middleware/isAdmin.js
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'Admin') {
        return next();
    }
    res.redirect('/'); // Redirect to home if not an admin
}

module.exports = { isAdmin };
