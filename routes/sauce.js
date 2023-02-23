const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer-config"); //on importe notre middleware dans le router pour qu'il soit executé avant les gestionnaires de node
const auth = require("../middleware/auth"); // pareil pour le middleware auth, qui passe en premier paramètre
const sauceCtrl = require("../controllers/sauce");
const like = require("../controllers/like");

/**
 * Définition des routes CRUD de la sauce 
 *
 * @Routes
 */

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.post("/:id/like", auth, like.likeSauce);

module.exports = router;
