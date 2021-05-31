// importation du pack multer
const multer = require('multer');

// gestion des extentions des fichiers enregistrés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// création d'un stokage pour les images importées
const storage = multer.diskStorage({

    destination: (req, file, callback) => { // destination du stockage
        callback(null, 'images');
    },

    filename: (req, file, callback) => { // génère un nom de fichier différent pour chaque image
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');