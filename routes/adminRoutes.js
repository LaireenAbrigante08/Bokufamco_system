const express = require('express');
const router = express.Router();
const { isAdmin } = require('../Middleware/isAdmin');
const productController = require('../controllers/productController');
const equipmentController = require('../controllers/equipmentController');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const loanController = require('../controllers/loanController')
const dashboardController = require('../controllers/dashboardController');
const multer = require('multer');
const path = require('path');

// Route to fetch all loans
router.get('/loans', adminController.getAdminLoans);

// Route to update loan status
router.post('/loans/:id/update-status', adminController.updateLoanStatus);
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
router.get('/orders', isAdmin, orderController.getAllOrders); // List all orders
router.get('/orders/:id', isAdmin, orderController.getOrderById); // View order details
router.post('/orders/:id/update', isAdmin, orderController.updateOrderStatus); // Update order status

// Admin Farm Supplies Routes
router.get('/farm-supplies', isAdmin, productController.getAdminFarmSupplies);
router.get('/farm-supplies/add',isAdmin,  productController.getAddProductForm);
router.post('/farm-supplies/add', isAdmin, upload.single('picture'), productController.addProduct);
router.get('/farm-supplies/edit/:id', isAdmin, productController.showEditProductForm);
router.post('/farm-supplies/edit/:id', isAdmin, upload.single('picture'), productController.updateProduct);
router.post('/farm-supplies/delete/:id',  isAdmin,productController.deleteProduct);

// Admin Equipment Routes
router.get('/equipment', isAdmin, equipmentController.getAllEquipment);
router.get('/equipment/add', isAdmin, equipmentController.getAddEquipmentForm);
router.post('/equipment/add',  isAdmin, upload.single('picture'), equipmentController.addEquipment);
router.get('/equipment/edit/:id',  isAdmin,equipmentController.getEditEquipmentForm);
router.post('/equipment/edit/:id', isAdmin, upload.single('picture'), equipmentController.updateEquipment);
router.post('/equipment/delete/:id', isAdmin,  equipmentController.deleteEquipment);

// Route for approving a member
router.post('/approve-member/:userId', isAdmin, adminController.approveMember);

router.get('/payments', isAdmin, loanController.viewPayments);
router.post('/payments/verify/:id', isAdmin, loanController.verifyPayment);


// Dashboard Route
router.get('/dashboard', dashboardController.getDashboard);
module.exports = router;
