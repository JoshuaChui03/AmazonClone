const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyUser = require('../middleware/verifyUser');

router.post('/login', authController.login);
router.get('/session', verifyUser, authController.getSession);
router.post('/logout', authController.logout);

module.exports = router;
