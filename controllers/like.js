//importation de notre modele Sauce qui contient notre système de like dislike
const Sauce = require('../models/Sauce');

//exportation de notre route 
exports.likesauceCtrl = (req, res, next) => {
console.log("je suis dans le controlleur like")

///////////////////////////////////////////////// affichage du req.body ////////////////////////////////////////////////////////
//la req sera envoyé par body au format JSON avec ces 2 propriétés
//{ userId: '63d0143f597c086191fbef7d', 
//like: -1 }


//Tout dabord nous allons chercher notre req.body (dans le req.body on a le userId et le like)
console.log("Contenu req.body - ctrl like");
console.log(req.body);


//récupérer l'id dans l'url de la requête
console.log("contenu req.params - ctrl like")
console.log(req.params.id)


//mise au format de l'id pour pouvoir aller chercher l'objet correspondant a celui de la base de données mongoDB
console.log("id en _id")
console.log({_id : req.params.id})

//aller chercher l'objet dans la base de donées
Sauce.findOne({_id : req.params.id}) //find one va chercher notre _id et le numéro d'objet dans req.params.id
.then((sauce) => { 
res.status(200).json(sauce);// on affiche l'objet dans le retour de la promesse
})
.catch((error) => res.status(404).json({error})) // affichage de lerreur dans la réponse du serveur






//le premiere cas sera que la valeur de like soit +1 quand on recoit la demande d'incrémenter les like
//like = 1 (like +1)

//cependant si on click a nouveau sur le même pouce celui si reviens au stade initial
//like = 0 (like = 0, pas de vote)

//le troisième cas est que quand on clique sur le pouce dislike on décrémente, 
//like = -1 (dislike = +1)

//cependant si on click a nouveau sur le même pouce celui si reviens au stade initial
//like = 0 (dislike = 0)
}