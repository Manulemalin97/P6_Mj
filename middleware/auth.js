//on importe jsonwebtoken
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

/**
 * Middleware d'authentification
 *
 * @Auth
 */

//Middleware permettant d"extraire les infos contenu du token et les transmette aux autres middlewares
module.exports = (req, res, next) => {
  try {
    //on récupere notre token dans le header, on utilise split pour diviser la chaine de caractere en tableau et on recupere 1 qui est notre token comme 0 est le 'bearer'
    const token = req.headers.authorization.split(" ")[1];
    //méthode verify de jsonwebtoken, on lui passe le token qu'on a récupéré ainsi que la clé secrète
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
    // si le jeton est expiré alors une erreur est levée et on va dans le catch.
    console.log("Token décodé", decodedToken); //iat returns the number of milliseconds that has passed since 1 January 1970 UTC (the Unix time)

    // on récupere notre userid specifique
    const userId = decodedToken.userId;

    //on crée lobjet auth avec un champ userId
    if (req.body.userId && req.body.userId !== userId) {
      //L' opérateur d' inégalité stricte ( !==) vérifie si ses deux opérandes ne sont pas égaux, renvoyant un résultat booléen.
      throw "identifiant incorrect"; //L'opérateur "throw" génère une erreur.
    } else {
      // tout est ok, on continue.
      req.auth = {
        userId: userId, // on rajoute l'objet auth avec un champ user id, pour le transmettre aux autres middlewares ou au gestonnaire de routes
      };
      next();
    }
  } catch (error) {
    console.log("AUTH: " + error);
    res.status(401).json({
      error: new Error("Requête Invalide!"),
    });
  }
};

//decoded token got 3 parts : header / payload and signature
