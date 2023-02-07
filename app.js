// On utilise la commande, npm install express --save pour l'enregistrer dans le package json

//on aura besoin d'express, on utilise alors require pour importer express
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require('path')


const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://manujansen:i35b8Ue59Sa8HynH@cluster0.7jlbhre.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


  app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});





app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//const app qui sera notre application, on appelle la fonction express, on la crée

//enfin on exporte notre app pour pouvoir l'utiliser ou on veut notamment dans le serveur node.
module.exports = app;
