// Ajout des packages suplémentaires
const express = require('express');
const router = express.Router();

//ajout du controllers
const sauceCtrl = require('../controllers/sauces');

// Import du middleware authentification pour sécuriser les routes
const auth = require('../middleware/auth');

//Import du middleware multer pour la gestion des images
const multer = require ('../middleware/multer-config');

// les routes de l application avec protection par authentification et acces au fichier image (multer)
router.post ('/', auth, multer, sauceCtrl.createSauce);
router.put ('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);



module.exports = router;