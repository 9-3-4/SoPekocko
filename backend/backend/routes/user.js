const express = require('express');
const router = express.Router();

//associer les fonctions au differentes routes
const userCtrl = require('../controllers/user');


router.post('/signup', userCtrl.signup);// pour envoyer email, password d un nouvelle utilisateur
router.post('/login', userCtrl.login);// pour envoyer email, password d un utilisateur existant

module.exports = router;