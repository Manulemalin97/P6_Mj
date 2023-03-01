/**
 *  like.js
 *  controlleur like
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

//importation de notre modele Sauce qui contient notre système de like dislike
const Sauce = require("../models/Sauce");

//exportation de notre route, on est dans le controlleur like
exports.likeSauce = (req, res, next) => {
  let idUser = req.body.userId; //Tout dabord nous allons chercher notre req.body (dans le req.body on a le userId et le like)
  let idSauce = req.params.id; //récupérer l'id dans l'url de la requête
  let like = req.body.like; //on accede au corps de la req de like

  //aller chercher l'objet dans la base de donées
  Sauce.findOne({ _id: idSauce }) //find one va chercher notre _id et le numéro d'objet dans req.params.id
    .then((sauce) => {
      /////////////////////////////////////////////// Ajout de Like / Dislike /////////////////////////////////////////////////////////////////////////

      /**
       *  like = 1 (likes +1 )
       *
       * @Like
       */

      //on vérifie si l'utilisateur avait déjà liké cette sauce en vérifiant si son id est présent dans le tableau Liked
      if (like === 1 && !sauce.usersLiked.includes(idUser)) {
        //mise a jour objet BDD
        Sauce.updateOne(
          //mise a jour l'utilisateur en incluant l'id
          { _id: idSauce }, // _id est utilisé par MongoDB pour stocker l'id unique de chaque document.
          {
            $inc: { likes: 1 }, //opérateur inc pour incrément, on incrément un champ spécifique , dans nos accolades on a notre champ et valeur
            $push: { usersLiked: idUser }, // opérateur push ajoute une valeur spécifique à un tableau,
          }
        )
          .then(() => res.status(201).json({ message: "Sauce like +1" }))
          .catch((error) => res.status(400).json({ error })); // bad request
      }

      /**
       * like -1  ( dislikes +1 )
       *
       * @Dislike
       */

      //on vérifie si l'utilisateur avait déjà liké cette sauce en vérifiant si son id est présent dans le tableau usersLiked
      if (like === -1 && !sauce.usersDisliked.includes(idUser)) {
        //mise a jour objet BDD
        Sauce.updateOne(
          { _id: idSauce },
          {
            $inc: { dislikes: 1 }, //opérateur inc pour dislike
            $push: { usersDisliked: idUser }, // opérateur push ajoute une valeur spécifique à un tableau,
          }
        )
          .then(() => res.status(201).json({ message: "Sauce Dislike +1" }))
          .catch((error) => res.status(400).json({ error })); // bad request
      }

      /////////////////////////////////////////////// Annulation de Like / Dislike /////////////////////////////////////////////////////////////////////////

      /**
       * Annulation du like = 0
       *
       * @Like
       */

      if (like === 0) {
        // on annule un like
        if (sauce.usersLiked.includes(idUser)) {
          //on vérifie si l'utilisateur avait déjà liké cette sauce en vérifiant si son id est présent dans le tableau usersLiked

          //mise a jour objet BDD
          Sauce.updateOne(
            //mets à jour un document dans la collection MongoDB "Sauces"
            { _id: idSauce },
            {
              $inc: { likes: -1 }, // avec inc on décrément de 1
              $pull: { usersLiked: idUser }, //et on le retire de la BDD
            }
          )
            .then(() => res.status(201).json({ message: "Sauce like 0" }))
            .catch((error) => res.status(400).json({ error })); // bad request
        }

        /**
         * Annulation du dislike = 0
         *
         * @Dislike
         */

        if (sauce.usersDisliked.includes(idUser)) {
          //on annule un dislike

          //mise a jour objet BDD
          Sauce.updateOne(
            { _id: idSauce },
            {
              $inc: { dislikes: -1 }, //opérateur inc annule le dislike pour revenir a 0
              $pull: { usersDisliked: idUser }, // opérateur pull retire le dislike du tableau,
            }
          )
            .then(() => res.status(201).json({ message: "Sauce dislike 0" }))
            .catch((error) => res.status(400).json({ error })); // bad request
        }
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
