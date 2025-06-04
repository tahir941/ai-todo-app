const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // make sure the path is correct

router.post('/login', authController.login);
router.post('/register', authController.register); // ✅ add this line
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPasswordWithToken);

module.exports = router;
