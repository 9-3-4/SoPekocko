const bcrypt = require('bcrypt');//hashage-cryptage des mots de passe
const jwt = require('jsonwebtoken');
const User = require("../models/user");

//enregistrement utilisateurs
exports.signup = (req, res, next) => {
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
//pour connecter utilisateurs existant a l application
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })//pour trouver un utilisateur
      .then(user => {
        console.log(user);
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });//si utilisateur n a pas ete trouve
        }
        bcrypt.compare(req.body.password, user.password)//comparer mdp et hash
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });//trouver utilisateur mais mdp faux
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },//pour le bon utilisateur a sa sauce et ne pas modifier d autre sauce a d autre utilisateur
                'RANDOM_TOKEN_SECRET',//cle secrete pour l encodage
                { expiresIn: '24h' }//expiration a 24h
              )
            });//comparaison bonne et renvoie ID de l utilisateur
          })
          .catch(error => res.status(500).json({ error }));//si probleme de connection serveur
      })
      .catch(error => res.status(500).json({ error }));//si probleme connection serveur
  };
