// importation des models des sauces
const Sauce = require('../models/Sauce');

// pack file system pour modfifier et supprimer des fichiers
const fs = require('fs');
const { update } = require('../models/Sauce');

//création de sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //création en objet
    delete sauceObject._id; //suppression de l'id de la sauce
    const sauce = new Sauce({ // création d'une nouvelle sauce
        ...sauceObject, // ajout du req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //génère l'url de l'image
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutée' }))
        .catch(error => res.status(400).json({ error }));
};

// like et dislike des sauces
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    // condition pour ajouter un like
    if (like === 1) {
        Sauce.updateOne(
            {
                _id: req.params.id,
                usersLiked: { "$ne": req.params.id }
            },
            {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId }
            })
            .then(() => res.status(200).json({ message: 'vous likez' }))
            .catch(error => res.status(400).json({ error }));
    }
    // condition pour ajouter un dislike
    else if (like === -1) {
        Sauce.updateOne(
            {
                _id: req.params.id,
                usersDisliked: { "$ne": req.params.id }
            },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId }
            })
            .then(() => res.status(200).json({ message: 'vous dislikez' }))
            .catch(error => res.status(400).json({ error }));
    }
    // condition pour supprimer son avis
    else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                // condition pour enlever un like
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne(
                        {
                            _id: req.params.id,
                            usersLiked: req.params.id
                        },
                        {
                            $inc: { likes: -1 },
                            $push: { usersLiked: req.body.userId }
                        })
                        .then(() => res.status(200).json({ message: 'vous ne likez pas finalement' }))
                        .catch(error => res.status(400).json({ error }));
                }
                // condition pour enlever un dislike
                else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({
                        _id: req.params.id,
                        usersDisliked: req.params.id
                    },
                        {
                            $inc: { dislikes: -1 },
                            $push: { usersDisliked: req.body.userId }
                        })
                        .then(() => res.status(200).json({ message: 'vous ne dislikez pas finalement' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};

// modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //  test du cas : nouvelle image (req.file) ou non
        {
            ...JSON.parse(req.body.sauce), // récupération des informations de l'objet
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // générer une nouvelle image
        } : { ...req.body }; // si pas de nouvelle image prendre en compte que le body
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // en cas de modification des paramètres de la sauce
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // trouve l'objet de la sauce à supprimer dans la base de donnée
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // recherche de l'image par l'extention du fichier
            fs.unlink(`images/${filename}`, () => { // suppression de l'image trouvée
                Sauce.deleteOne({ _id: req.params.id }) // suppression de l'object dans la base de donnée
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};


// récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

//récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};