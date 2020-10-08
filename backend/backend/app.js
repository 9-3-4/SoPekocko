//import packages supplémantaire
const express = require('express');
const bodyParser = require('body-parser');//pour gerer la demande POST
const mongoose = require('mongoose');
const path = require('path'); // nous donne access au chemin des fichiers 


// Import des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//creation fonction express
const app = express();

//connection API à la base de donnée MongoDB
mongoose.connect('mongodb+srv://user_1:Sopeko1@cluster0.pp0he.mongodb.net/SoPek?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//pour eviter les erreurs de CORS, header, pour permettre les acces de l application a l API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//tout le monde a le droit d acces a notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// autorisation d utiliser certaines entete
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//et sur certaines methodes
    next();
  });

  //transformer le coprs de la requête en objet json utilisable
  app.use(bodyParser.json()); 

  // pour dire a express de servir ce dossier image static lors de requete a /images
  app.use('/images', express.static(path.join(__dirname, 'images')));
  
  // Routes attendues pour les differentes API
  app.use('/api/sauce', sauceRoutes);
  app.use('/api/auth', userRoutes);

module.exports = app;

 

