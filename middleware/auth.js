//on importe jsonwebtoken
const jwt = require('jsonwebtoken');
 

//Middleware permettant d"extraire les infos contenu du token et les transmette aux autres middlewares
module.exports = (req, res, next) => {
   try {
    //on récupere notre token dans le header, on utilise split pour diviser la chaine de caractere en tableau et on recupere 1 qui est notre token comme 0 est le 'bearer'
       const token = req.headers.authorization.split(' ')[1];
       //méthode verify de jsonwebtoken, on lui passe le token qu'on a récupéré ainsi que la clé secrète
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       console.log(decodedToken)
       // on récupere notre userid specifiquement
       const userId = decodedToken.userId;
       //on crée lobjet auth avec un champ userId
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};