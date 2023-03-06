/**
 *  sauce.js
 *  Controlleur pour la gestion des sauces
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

//bcrypt pour saler le mdp
const bcrypt = require("bcrypt");

//Pour pouvoir créer et vérifier les tokens d'authentification, il nous faudra le package jwt
const jwt = require("jsonwebtoken");

//on importe notre model User
const User = require("../models/User");
const dotenv = require("dotenv").config();

/**
 * Middleware signup
 *
 * @Signup
 */

exports.signup = (req, res, next) => {
  console.log("signup");
  bcrypt //nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois.
    .hash(req.body.password, 10) //il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
    .then((hash) => {
      //dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données,
      console.log("bcrypt:" + hash);
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user //On crée un nouvel utilisateur dans une base de données en utilisant une fonction appelée "save()"
        .save()
        .then(() => {
          //res.status 201, utilisateur crée !
          res.status(201).json({ message: "Utilisateur créé !" });
        })

        .catch((error) => {
          console.log("error:" + error);
          res.status(400).json({ error }); //Si la création de l'utilisateur échoue, renvoye une réponse avec un code de statut HTTP 400
        });
    })
    //Enfin, si une erreur survient lors de la tentative de connexion à la base de données, renvoyer une réponse avec un code de statut HTTP 500(server)
    .catch((error) => res.status(500).json({ error }));
};

/**
 * Middleware login
 *
 * @Login
 */

exports.login = (req, res, next) => {
  //Nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la BDD
  console.log("login");
  User.findOne({ email: req.body.email }) // on utilise la méthode findOne de notre classe user, on lui passe un objet avec un champ email et la valeur transmise par le client

    .then((user) => {
      //Nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :
      if (!user) {
        //Si l'e-mail correspond à un utilisateur existant, nous continuons.
        return res
          .status(401) //Dans le cas contraire, nous renvoyons une erreur401 Unauthorized.
          .json({ message: "Paire identifiant/mot de passe incorrecte" }); // ne pas préciser d'ou vient le problème par question de sécurité.
      }
      bcrypt
        .compare(req.body.password, user.password) //Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        .then((valid) => {
          if (!valid) {
            //S'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token.
            return res
              .status(401) //S'ils ne correspondent pas, nous renvoyons une erreur401 Unauthorized
              .json({ message: "Paire identifiant/mot de passe incorrecte" });
          }
          let token = jwt.sign(
            //Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.Ce token contient l'ID de l'utilisateur en tant que payload
            { userId: user._id },
            process.env.AUTH_TOKEN,
            {
              

              //chiffrage secret
              expiresIn: process.env.LIFE_TOKEN, //durée de vie du token
            }
          );

          res.status(200).json({
            // 200 OK
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => res.status(401).json({ error })); //401 erreur traitement server
    })
    .catch((error) => res.status(500).json({ error })); //500 erreur de traitement server
};
