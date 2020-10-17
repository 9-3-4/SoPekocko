// Import du modèle de la sauce
const Sauce = require('../models/sauce');

// Ajout du package File System pour acceder aux fonction qui permet la suppression des sauces
const fs = require ('fs');

//creation sauce POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); 
    delete sauceObject._id;
    const sauce = new Sauce({ 
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`      //url de l image
    }); 
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));

    sauceObject.likes = 0;                      // à sauce on ajoute like
    sauceObject.dislikes = 0;                   // à sauce on ajoute dislike
    sauceObject.usersLiked = [];                // déclaration tableau des utilisateurs qui aiment
    sauceObject.usersDisliked = [];             //declaration tableau des utilisateurs qui n aiment pas

   };

  //modification sauce PUT
  exports.modifySauce = (req, res, next) =>  {
    const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, {... sauceObject, _id: req.params.id})       //mise a jour de sauce
    .then(() => res.status(200).json({message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({error}));
  };
 
  //suppression sauce DELETE
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})                                                //trouve la sauce dans la base de donnee
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];                             //extraire le nom du fichier pour le supprimer
      fs.unlink(`images/${filename}`, () => {                                           //suppression fichier
        Sauce.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
        .catch(error => res.status(400).json({error}));
      });
    })
    .catch(error => res.status(500).json({error}));
  };
  
  //recuperation toute Sauce (GET)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// recuperation une Sauce (GET)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//gestion du like/dislike
exports.sauceLikeDislike = (req, res, next) => {
  if (req.body.like === 1) {                            // si aime la sauce
  Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }) // 1 like et on le pousse dans le tableau usersLiked
      .then((sauce) => res.status(200).json({ message: 'like en plus !' }))
      .catch(error => res.status(400).json({ error }));
} else if (req.body.like === -1) {                      // si aime pas la sauce
  Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }) //  1 dislike et on le pousse dans le tableau usersDisliked
      .then((sauce) => res.status(200).json({ message: 'dislike en plus !' }))
      .catch(error => res.status(400).json({ error }));
} else {                                                // si l'utilisateur enleve son vote, like === 0
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          if (sauce.usersLiked.includes(req.body.userId)) { // si l'array userLiked contient le id de like
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) // $pull :  vide le tableau userLiked et enleve un like pour les like en double
                  .then((sauce) => { res.status(200).json({ message: 'like en moin !' }) })
                  .catch(error => res.status(400).json({ error }))
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                  .then((sauce) => { res.status(200).json({ message: 'dislike en moins !' }) })
                  .catch(error => res.status(400).json({ error }))
          }
      })
      .catch(error => res.status(400).json({ error }));
}
};




