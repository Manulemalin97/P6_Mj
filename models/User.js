/**
 *  User.js
 *  Création de notre Schema User
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

const mongoose = require("mongoose");

//plugin uniqueValidator sert à ce qu'un utilisateur ne puisse pas se s"inscrire plusieurs fois avec la même adresse
const uniqueValidator = require("mongoose-unique-validator");

//La méthode  Schema  de Mongoose permet de créer un schéma de données pour votre base de données MongoDB.
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //champ obligatoire de type String qui doit être unique. Il représente l'adresse email de l'utilisateur.
  password: { type: String, required: true }, //champ obligatoire de type String. Il représente le mot de passe de l'utilisateur.
});

// on applique le validateur au schema avant d'en faire un modèle grâce a la méthode .plugin
userSchema.plugin(uniqueValidator);

//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("User", userSchema);
