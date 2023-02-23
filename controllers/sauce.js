const Sauce = require("../models/Sauce");

// fs  signifie « file system » (soit « système de fichiers », en français).
//  Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers,
//   y compris aux fonctions permettant de supprimer les fichiers.
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // on parse car
  delete sauceObject._id; // on supprime l'id stocké car notre id est généré automatiquement par notre base de données.
  delete sauceObject._userId; // et le champ user id de la personne qui a crée l'objet, ne jamais faire confiance au client.
  const sauce = new Sauce({
    // on crée notre sauce
    ...sauceObject, // on affiche ce qui reste en ayant enlevé les 2 champs

    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, //generation de lurl
    //propriétés de lobjet requete 1.protocol 2. le nom d'hôte (/image ou on stock nos images) 3. le nom de fichier donné par multer
  });
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * On récupère toutes les sauces
 *
 * @getAllSauce
 */
exports.getAllSauce = (req, res, next) => {
  // requete, réponse, middleware next qui nous envoie au prochain middleware
  Sauce.find() // find recupere tout
    .then((sauce) => res.status(200).json(sauce))
    .catch((errorMsg) => res.status(400).json({ error: errorMsg }));
};

/**
 * On récupère une sauce
 *
 * @getOneSauce
 */

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //find one recupere un élément
    .then((sauce) => res.status(200).json(sauce)) // si sa a marché, réussite
    .catch((errorMsg) => res.status(404).json({ error: errorMsg })); //si non, erreur
};

/**
 * On contrôle l'authentification
 *
 * @VerifyUser
 */
function verifyUser(req, userId) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
  const tokenUserId = decodedToken.userId;
  if (userId == tokenUserId) {
    return true;
  } else {
    return false;
  }
}

/**
 * On modifie les sauces
 *
 * @modifySauce
 */

exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      //on verifie que la sauce appartient bien à l'utilisateur avec verifyUser
      if (!verifyUser(req, sauce.userId)) {
        return res.status(403).json({ message: "Action non autorisée" });
      }

      //on va récupérer seulement le nom de notre sauce en utilisant la méthode split puis slice pour récupérer la partie de fin
      let filename = "images/" + sauce.imageUrl.split("/").slice(-1);
      if (fs.existsSync(filename)) {
        fs.unlink(filename, (err) => {
          if (err) {
            // probleme lors de la supression de l'image
            console.log(err);
            return res.status(500).json({ err });
          }
        });
        //la supression de la précédente image c'est bien déroulé, on ajoute la nouvelle
        const sauceObject = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
        // Mise à jour de la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    });
  } else {
    // Si l'image n'est pas modifée
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      //on verifie que la sauce appartient bien à l'utilisateur avec verifyUser
      if (!verifyUser(req, sauce.userId)) {
        return res.status(403).json({ message: "Action non autorisée .." });
      }
      const sauceObject = { ...req.body };
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  }
};

/**
 * On supprime les sauces
 *
 * @deleteSauce
 */

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // récupération de l'objet en base
    .then((sauce) => {
      if (!verifyUser(req, sauce.userId)) {
        //on verifie que la sauce appartient à l'utilisateur avec verifyUser
        return res.status(403).json({ message: "Action non autorisée" });
      }
      const filename = sauce.imageUrl.split("/images/")[1]; // On récupère avec .split le nom ficher image dans l'URL

      fs.unlink(`images/${filename}`, () => {
        //The fs.unlink() method is used to remove a file or symbolic link from the filesystem
        Sauce.deleteOne({ _id: req.params.id })
          .then(res.status(200).json({ message: "Sauce supprimée !" })) // succès
          .catch((error) => res.status(400).json({ error })); // erruer
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
