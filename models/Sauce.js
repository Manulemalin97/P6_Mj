const mongoose = require("mongoose");

/**
 * Schema/modèle sauce
 *
 * @Sauce
 */

//La méthode  Schema  de Mongoose permet de créer un schéma de données pour votre base de données MongoDB.
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },

  //système de like dislike
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});


//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("Sauce", sauceSchema);
