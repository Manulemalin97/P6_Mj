const express = require("express");
const router = express.Router();
const multer = require ('../middleware/multer-config')
//on importe notre middleware dans le router pour qu'il soit executé avant les gestionnaires de node
const auth = require('../middleware/auth');

const sauceCtrl = require("../controllers/sauce");

//importation du controller/like.js
const like = require("../controllers/like")
//on mets auth avant les gestionnaires de route sinon ils seraient appellées en premier et sa n'aurait servi a rien
router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.post("/:id/like", auth, like.likesauceCtrl);





//auth récupère d'abord les informations d'authentification, 
//multer change le format de la requete.



module.exports = router;