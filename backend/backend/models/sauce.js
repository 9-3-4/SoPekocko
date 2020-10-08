//creation schema pour stocke les sauces dans la base de donnee
const mongoose = require('mongoose');//recuperation de mongoose

//schema des modele de sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },//id de l'utilisateur qui a crée la sauce
    name: { type: String, required: true },//nom de la sauce
    manufacturer: { type: String, required: true },// fabricant
    description: { type: String, required: true }, // description
    mainPepper: { type: String, required: true },// principal ingrédient
    imageUrl: { type: String, required: true }, // url de l'image sauce
    heat: { type: Number, required: true },// note 
    likes: { type: Number, default: 0, required: true },// nombre d'utilisateur qui aiment la sauce
    dislikes: { type: Number, default: 0, required: true },//nombre d'utilisateur qui n'aiment pas
    usersLiked: { type: [String], required: true },// tableau id d'utilisateur ayant aimé
    usersDisliked: { type: [String], required: true }// tableau id d'utilisateur n'ayant pas aimé
});

//export du modele de sauce
module.exports = mongoose.model('Sauce', sauceSchema); 