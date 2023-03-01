/**
 *  user.js
 *  Création de nos routes user
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

const express = require("express"); // on crée un routeur express
const router = express.Router(); // on définit un nouveau routeur en utilisant la méthode Router()
const userCtrl = require("../controllers/user"); // contient les fonctions qui seront exécutées lorsque les routes définies dans ce fichier seront appelées

/**
 * Définition des routes d'authentification
 *
 * @Routes
 */

//route post, on envoi email et mdp
router.post("/signup", userCtrl.signup); ////Cette route permet de créer un utilisateur.
router.post("/login", userCtrl.login); ////Cette route permet de se connecter à un compte existant.

//exporte le module router pour que d'autres modules puissent l'importer et l'utiliser en tant que middleware.
module.exports = router;
