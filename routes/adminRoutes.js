const express = require('express');
const router = express.Router();
const { isAdmin } = require('../Middleware/isAdmin');
const productController = require('../controllers/productController');
const equipmentController = require('../controllers/equipmentController');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/product');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid conflicts
    }
});
const upload = multer({ storage: storage });


router.use(isAdmin);

// Admin Dashboard Route
router.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.role === 'Admin') {
        res.render('admin');
    } else {
        res.status(403).send('Access denied');
    }
});

// Admin Orders Routes
router.get('/orders', orderController.getAllOrders); // List all orders
router.get('/orders/:id', orderController.getOrderById); // View order details
router.post('/orders/:id/update', orderController.updateOrderStatus); // Update order status

// Admin Farm Supplies Routes
router.get('/farm-supplies', productController.getAdminFarmSupplies);
router.get('/farm-supplies/add', productController.getAddProductForm);
router.post('/farm-supplies/add', upload.single('picture'), productController.addProduct);
router.get('/farm-supplies/edit/:id', productController.showEditProductForm);
router.post('/farm-supplies/edit/:id', upload.single('picture'), productController.updateProduct);
router.post('/farm-supplies/delete/:id', productController.deleteProduct);

// Admin Equipment Routes
router.get('/equipment', equipmentController.getAllEquipment);
router.get('/equipment/add', equipmentController.getAddEquipmentForm);
router.post('/equipment/add', upload.single('picture'), equipmentController.addEquipment);
router.get('/equipment/edit/:id', equipmentController.getEditEquipmentForm);
router.post('/equipment/edit/:id', upload.single('picture'), equipmentController.updateEquipment);
router.post('/equipment/delete/:id', equipmentController.deleteEquipment);

// Route for approving a member
router.post('/approve-member/:userId', adminController.approveMember);

// Admin Member Information Route
router.get('/member', (req, res) => {
    res.render('admin/member');
});

// Admin Loans Route
router.get('/loans', (req, res) => {
    res.render('admin/loans');
});

module.exports = router;
