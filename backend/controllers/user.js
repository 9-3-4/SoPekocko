const bcrypt = require('bcrypt');                         //chiffrage des mots de passe
const jwt = require('jsonwebtoken');                      //sécurité via jetons
const mailValidator = require('email-validator');         //validation format email
const passwordValidator = require('password-validator');  //sécurité Mot de passe

const User = require("../models/user");

var schema = new passwordValidator();                     // Creer le schema de validation de mot de passe

schema                                                    // propriétés du schema pour le mot de passe  
.is().min(8)                                              // Longueur minimale 8                              
.is().max(20)                                             // Longueur maximale 200                             
.has().uppercase()                                        // Doit avoir des lettres majuscules                         
.has().lowercase()                                        //  Doit avoir des lettres minuscules                         
.has().digits(1)                                          //  Doit avoir au moins 1 chiffres                           
.has().not().spaces()                                     //  Ne doit pas avoir d'espaces                                                                          

//enregistrement compte utilisateurs avec verification email et mot de passe
exports.signup = (req, res, next) => {
  if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {               // verifier la validité de email et mot de passe
    throw { error: "Veuillez indiquer une adresse email et un mot de passe valide" }                    // erreur si invalide
    } else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) {        // alors si les 2 sont valide
    bcrypt.hash(req.body.password, 10)                                                                  //chiffrement du mot de passe
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
    }
  };
//pour connecter utilisateurs existant a l application
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })                                                           //pour trouver un utilisateur
      .then(user => {
        console.log(user);
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });                         //si utilisateur n a pas ete trouve
        }
        bcrypt.compare(req.body.password, user.password)                                              //comparer mdp et hash
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });                     //trouver utilisateur mais mdp faux
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },                                                                 //pour le bon utilisateur a sa sauce et ne pas modifier d autre sauce a d autre utilisateur
                'RANDOM_TOKEN_SECRET',                                                                //cle secrete pour l encodage
                { expiresIn: '24h' }                                                                  //expiration a 24h
              )
            });                                                                                       //comparaison bonne et renvoie ID de l utilisateur
          })
          .catch(error => res.status(500).json({ error }));                                           //si probleme de connection serveur
      })
      .catch(error => res.status(500).json({ error }));                                               //si probleme connection serveur
  };
