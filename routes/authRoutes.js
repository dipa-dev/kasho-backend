const express = require('express');
const router  = express.Router();
const { register, signin, adminLogin} = require('../controllers/authController');

router.post('/register', register);
router.post('/signin', signin);
router.post('/admin/signin', adminLogin);

module.exports = router;
