//creation schema pour stocke les sauces dans la base de donnee
const mongoose = require('mongoose');

//schema des modele de sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0, required: true },
    dislikes: { type: Number, default: 0, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }
});

//export du modele de sauce
module.exports = mongoose.model('Sauce', sauceSchema); 