//pour stocker les donnees dans la BDD
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);//pour eviter le partage de meme adresse mail

module.exports = mongoose.model('User', userSchema);