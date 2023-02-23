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

      if (like === 1 && !sauce.usersLiked.includes(idUser)) {
        //req dans lurl si like strictement = 1 on a true
       
        //mise a jour objet BDD
        Sauce.updateOne(
          //mise a jour l'utilisateur en incluant l'id
          { _id: idSauce },
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

      if (like === -1 && !sauce.usersDisliked.includes(idUser)) {
        // on utilise "!" pour inverser la condition qui est false et maintenant elle est true
        //req dans lurl si like strictement = -1 on a true
        
        //mise a jour objet BDD
        Sauce.updateOne(
          { _id: idSauce },
          {
            $inc: { dislikes: 1 }, //opérateur inc pour revenir a 0
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
          
          //mise a jour objet BDD
          Sauce.updateOne(
            { _id: idSauce },
            {
              $inc: { likes: -1 }, //opérateur inc pour revenir a 0
              $pull: { usersLiked: idUser }, // opérateur pull retire une valeur spécifique à un tableau,
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
              $inc: { dislikes: -1 }, //opérateur inc pour revenir a 0
              $pull: { usersDisliked: idUser }, // opérateur pull retire une valeur spécifique à un tableau,
            }
          )
            .then(() => res.status(201).json({ message: "Sauce dislike 0" }))
            .catch((error) => res.status(400).json({ error })); // bad request
        }
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
