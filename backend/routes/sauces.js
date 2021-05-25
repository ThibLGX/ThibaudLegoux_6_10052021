// importation du pack express
const express = require('express');
const router = express.Router();

//importation des controllers des sauces pour les routes
const saucesCtrl = require('../controllers/sauces');

// importation des middlewares pour assurer d'être autentifié 
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

//route de création de sauce
router.post('/', auth, multer, saucesCtrl.createSauce);

// route pour like ou dislike une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

// route pour modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//route pour supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//route pour récuper toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);

//route pour récuper une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);

module.exports = router;
