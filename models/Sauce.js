/**
 *  Sauce.js
 *  Création de notre Schema Sauce
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

const mongoose = require("mongoose");

//La méthode  Schema  de Mongoose permet de créer un schéma de données pour votre base de données MongoDB.
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, // ID de l'utilisateur qui a créé la sauce.
  name: { type: String, required: true }, // nom de la sauce.
  manufacturer: { type: String, required: true }, // fabricant de la sauce.
  description: { type: String, required: true }, // description de la sauce.
  mainPepper: { type: String, required: true }, // principal ingrédient de la sauce.
  imageUrl: { type: String, required: true }, // URL de l'image de la sauce.
  heat: { type: Number, required: true }, // force de la sauce sur une échelle de 1 à 10.

  //système de like dislike
  likes: { type: Number, required: true, default: 0 }, // nombre de likes de la sauce.
  dislikes: { type: Number, required: true, default: 0 }, // nombre de dislikes de la sauce.
  usersLiked: { type: [String], required: true }, // tableau des identifiants des utilisateurs ayant liké la sauce.
  usersDisliked: { type: [String], required: true }, // tableau des identifiants des utilisateurs ayant disliké la sauce.
});

//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("Sauce", sauceSchema);
