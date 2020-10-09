// Import du modèle de la sauce
const Sauce = require('../models/sauce');
// Ajout du package File System pour acceder aux fonction qui permet la suppression des sauces
const fs = require ('fs');

// // Creation voir une Sauce (GET)

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Creation voir une Sauce (GET)

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};


//creation sauce POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//url de l image
    }); 
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
   };

  
  //modification sauce PUT
  exports.modifySauce = (req, res, next) =>  {
    const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, {... sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({error}));
  };
 
  //suppression sauce DELETE
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})//trouve la sauce dans la base de donnee
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];//extraire le nom du fichier pour le supprimer
      fs.unlink(`images/${filename}`, () => {//suppression fichier
        Sauce.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
        .catch(error => res.status(400).json({error}));
      });
    })
    .catch(error => res.status(500).json({error}));
  };
  