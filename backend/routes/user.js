const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const userCtrl = require('../controllers/user');



router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;