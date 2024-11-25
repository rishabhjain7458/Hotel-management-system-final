const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/google-login', authController.googleLogin);

router.post('/login', authController.login);

module.exports = router;
