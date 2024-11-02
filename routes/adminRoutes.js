// Admin Dashboard Route
router.get('/adminDashboard', (req, res) => {
    // Check if the user is logged in and is an admin
    if (req.session.user && req.session.user.role === 'admin') {
        res.render('adminDashboard'); // Render the admin dashboard
    } else {
        res.status(403).send('Access denied'); // Forbidden access
    }
});
