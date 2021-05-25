//importation du pack mongoose
const mongoose = require('mongoose');

//pack pour assuré que l'email des utilisateurs sont unique dans la base de donnée
const uniqueValidator = require('mongoose-unique-validator');

//schéma des données utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);