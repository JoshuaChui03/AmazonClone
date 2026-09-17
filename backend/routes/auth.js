const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyAccount = require('../middleware/verifyAccount');

router.post('/login', authController.login);
router.get('/session', verifyAccount, authController.getSession);
router.post('/logout', authController.logout);

module.exports = router;
