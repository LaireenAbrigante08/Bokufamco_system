// config/upload.js
const multer = require('multer');
const path = require('path');

// Set storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Choose folder based on the request path or type
        let folder = 'product'; // Default folder
        if (req.path.includes('rentals')) {
            folder = 'rentals';
        }
        cb(null, `public/images/${folder}/`); // Set path based on folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with a unique name
    }
});
// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
};

// Export upload middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;
