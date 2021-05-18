const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const saucesCtrl = require('../controllers/sauces');

const multer = require('../middleware/multer-config');

router.post('/', auth, multer, saucesCtrl.createThing);
router.post('/:id/like', auth, saucesCtrl.likeThing);
router.put('/:id', auth, multer, saucesCtrl.modifyThing);
router.delete('/:id', auth, saucesCtrl.deleteThing);
router.get('/', auth, saucesCtrl.getOneThing);
router.get('/:id', auth, saucesCtrl.getAllThing);

module.exports = router;
