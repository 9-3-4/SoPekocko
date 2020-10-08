// Ajout des packages suplémentaires
const express = require('express');//recuperation d express
const router = express.Router();//creation router avec la methode d express

//ajout du controllers
const sauceCtrl = require('../controllers/sauce');// recuperation de controler pour les sauce

// Import du middleware authentification pour sécuriser les routes
const auth = require('../middleware/auth');//recuperation des middleware d authentification

//Import du middleware multer pour la gestion des images
const multer = require ('../middleware/multer-config');

// les routes de l application avec protection par authentification et acces au fichier image (multer)
router.post ('/', auth, multer, sauceCtrl.createSauce);
router.put ('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id',auth, sauceCtrl.getOneSauce);



module.exports = router;