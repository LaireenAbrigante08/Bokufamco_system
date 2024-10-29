const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
router.get('/landing', (req, res) => res.render('landing'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
