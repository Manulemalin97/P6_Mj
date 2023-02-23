
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

/**
 * Définition des routes d'authentification
 *
 * @Routes
 */

//route post, on envoi email et mdp
router.post("/signup", userCtrl.signup); //méthode signup
router.post("/login", userCtrl.login); //méthode login

module.exports = router;
