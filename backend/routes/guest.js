const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const verifyGuest = require('../middleware/verifyGuest');

router.post('/', guestController.createGuest);
router.get('/', verifyGuest, guestController.getGuest);
router.delete('/', verifyGuest, guestController.deleteGuest);

module.exports = router;
