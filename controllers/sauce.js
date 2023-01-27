const Sauce = require('../models/Sauce');

// fs  signifie « file system » (soit « système de fichiers », en français).
//  Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers,
//   y compris aux fonctions permettant de supprimer les fichiers.
const fs = require ('fs');
const jwt = require('jsonwebtoken');



exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId; 
  const sauce = new Sauce({
    ...sauceObject,
    
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    
  });
  console.log(sauce)    
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

//   Que fait le code ci-dessus ?

// Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data 
// et non sous forme de JSON. Le corps de la requête contient une chaîne thing, qui est simplement un objetThing converti en chaîne. 
// Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.

// Nous supprimons le champ_userId de la requête envoyée par le client car nous ne devons pas lui faire confiance 
// (rien ne l’empêcherait de nous passer le userId d’une autre personne). Nous le remplaçons en base de données par le _userId extrait du token par
//  le middleware d’authentification.

// Nous devons également résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename. 
// Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http'). Nous ajoutons '://', puis utilisons req.get('host')
//  pour résoudre l'hôte du serveur (ici, 'localhost:3000'). Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.


/////////////////////////////////////////////// récupérer toutes les Sauces //////////////////////////////////////////////////////
exports.getAllSauce= (req, res, next) => {
    Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({error: error}))
  };

  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error: error}))
  };

  // Dans cette version modifiée de la fonction, on crée un objet sauceObject qui regarde si req.file existe ou non. 
    // S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. 
    // On crée ensuite une instance Sauce à partir de sauceObject, puis on effectue la modification. Nous avons auparavant, 
    // comme pour la route POST, supprimé le champ _userId envoyé par le client afin 
    // d’éviter de changer son propriétaire et nous avons vérifié que le requérant est bien le propriétaire de l’objet.


    //vérifier que l'user qui modifie ou supprime la sauce en est bien l'auteur
    function verifyUser(req, userId){
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
      const tokenUserId = decodedToken.userId;
      if(userId == tokenUserId){
        return true
      }else{
        return false
      }
    };
//////////////////////////////////////////////////////////// Modifier sauce ///////////////////////////////////////////////

 exports.modifySauce = (req, res, next) => {
  if(req.file) { // Si l'image est modifiée, on supprime l'ancienne image dans /images
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
            if(!verifyUser(req, sauce.userId)){
              return res.status(403).json({message : "Action non autorisée"})
            }
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  const sauceObject =
                  {   
                      ...JSON.parse(req.body.sauce),//
                      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                  }
                  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                      .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                      .catch(error => res.status(400).json({ error }))
              });
          });
  } else { // Si l'image n'est pas modifée
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {//on verifie que la sauce appartient bien à l'utilisateur avec verifyUser
      if(!verifyUser(req, sauce.userId)){
        return res.status(403).json({message : "Action non autorisée"})
      }
      const sauceObject = { ...req.body } 
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => 
          res.status(200).json({ message: 'Sauce modifiée avec succès !' }))
          .catch(error => res.status(400).json({ error }))
    })}
};

//////////////////////////////////////////////////// Supprimer sauce ////////////////////////////////////////////////////////////////////
  exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id }) // récupération de l'objet en base
      .then((sauce) => {
        if(!verifyUser(req, sauce.userId)){//on verifie que la sauce appartient bien à l'utilisateur avec verifyUser
          return res.status(403).json({message : "Action non autorisée"})
        }
        const filename = sauce.imageUrl.split("/images/")[1]; // On récupère avec .split le nom ficher image dans l'URL
        
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(res.status(200).json({ message: "Sauce supprimée !" }))// succès
            .catch((error) => res.status(400).json({ error })); // erruer
        });
      })
      .catch((error) => res.status(500).json({ error }));
};



