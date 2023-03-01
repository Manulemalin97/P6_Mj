/**
 *  sauce.js
 *  Routes  des sauces
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

const express = require("express");
const router = express.Router(); //permet de créer un objet router à partir du module express. Cet objet est utilisé pour définir les routes de l'application.
const multer = require("../middleware/multer-config"); //on importe notre middleware dans le router pour qu'il soit executé avant les gestionnaires de node
const auth = require("../middleware/auth"); // pareil pour le middleware auth, qui passe en premier paramètre
const sauceCtrl = require("../controllers/sauce");
const like = require("../controllers/like");

/**
 * Définition des routes CRUD de la sauce
 *
 * @Routes
 */

//Les middlewares auth et multer sont utilisés pour protéger les routes et gérer les fichiers uploadés.
router.get("/", auth, sauceCtrl.getAllSauce);

// Cette route permet de récupérer toutes les sauces enregistrées dans la base de données.
router.post("/", auth, multer, sauceCtrl.createSauce);

//Cette route permet de créer une nouvelle sauce.
router.get("/:id", auth, sauceCtrl.getOneSauce);

//Cette route permet de supprimer une sauce en particulier, en fonction de son ID.
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//Cette route permet de modifier une sauce en particulier, en fonction de son ID.
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//
router.post("/:id/like", auth, like.likeSauce);

module.exports = router;
