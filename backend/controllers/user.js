const express = require('express');
const app = express();

// pack pour chiffrer le password
const bcrypt = require('bcrypt');

// importation du model utilisateur
const User = require('../models/User');

// pack pour géner le TOKEN et être identifié lors l'utilisation de l'application
const jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');

// création d'un utilisateur
exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Votre email ou mot de passe n'est pas valide veuillez vérifier à nouveau` });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// connexion d'un utilisateur
exports.login = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: `Votre email ou mot de passe n'est pas valide veuillez vérifier à nouveau` });
    }

    User.findOne({ email: req.body.email }) // on recupère l'utilisateur qui correspond à l'adresse mail
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) //comparaison du password entré par rapport à la base de donée
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id, // génère un userId
                        token: jwt.sign( // génère un TOKEN d'indentification
                            { userId: user._id }, //1er argument données a encoder
                            'RANDOM_TOKEN_SECRET', // clef secrete d'encodage
                            { expiresIn: '999h' } // configuration (temps limite d'expiration)
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
