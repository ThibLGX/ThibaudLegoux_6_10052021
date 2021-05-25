//importation du pack express
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const { body, validationResult } = require('express-validator');

//route pour la création d'un utilisateur
router.post('/signup', body('email').isEmail(), body('password').isLength({ min: 5 }), userCtrl.signup); // sécurisé par express validator

//route pour la connexion d'un utlisateur
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 5 }), userCtrl.login); // sécurisé par express validator

module.exports = router;