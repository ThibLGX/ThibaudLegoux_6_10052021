//importation du pack express
const express = require('express');

//importation du pack body-parser pour récuper les données exploitables
const bodyParser = require('body-parser');

//importation du pack mongoose pour intéragir avec mongoDB
const mongoose = require('mongoose');

// pack path pour importer les images avec multer
const path = require('path');

//récupération des routes des sauces
const SaucesRoutes = require('./routes/sauces');

//récupération des routes "utilisateur"
const userRoutes = require('./routes/user');

// Plugin de sécurité contre des attaques
const helmet = require("helmet");

const app = express();

//connection au compte de mongoose pour l'utilisation de sa base de donnée
mongoose.connect('mongodb+srv://thibaud2dev:4c4HRWPe9ytQhLk@cluster0.mht59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//CORS autorisation des methodes, des headers et de l'origine des requètes (sécurité par defaut)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyParser.json()); //Transformer le corps de la requête en objet javascript utilisable

app.use('/images', express.static(path.join(__dirname, 'images'))); // gestion des images en statique

app.use(helmet()); // Exécution du plugin de sécurité

// les routes de l'application
app.use('/api/sauces', SaucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

