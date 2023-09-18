const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');
const auth = require('../middleware/auth')

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/slots', auth.authorAuthentication,controller.getAvailableSlots);
router.post('/register-slot', auth.authorAuthentication,controller.registerSlot);
router.put('/update-slot/:slotId',auth.authorAuthentication, controller.updateSlot);

module.exports = router;
