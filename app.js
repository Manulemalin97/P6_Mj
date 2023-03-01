/**
 *  app.js
 *  Création et démarrage de notre application express
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

/**
 * Définition de notre app
 *
 * @App
 */

//on aura besoin d'express, on utilise alors require pour importer express
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path"); //accéder au path de notre serveur
const dotenv = require("dotenv").config(); //package dotenv variables d'environnement

// On crée express
const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect(
    // on utilise des 'backticks pour utiliser des variables' $ pour les variables d'environnement, process.env pour chercher notre var denvironnement
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Cette fonction est un middleware qui permet de décoder les données JSON envoyées dans le corps de la requête HTTP,
// et de les rendre disponibles dans la propriété req.body de l'objet request.
app.use(express.json());

//Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//La méthode app.use() nous permet d'attribuer un middleware à une route spécifique de votre application.
app.use("/api/auth", userRoutes); //racine lié à l'auth et on passe userRoutes*/
app.use("/api/sauces", sauceRoutes);
//On configure notre serveur pour renvoyer des fichiers statiques pour une route donnée avec  express.static()  et  path.join().
app.use("/images", express.static(path.join(__dirname, "images")));

//enfin on exporte notre app pour pouvoir l'utiliser ou on veut notamment dans le serveur node.
module.exports = app;
