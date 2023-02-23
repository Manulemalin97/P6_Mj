
/**
 * 
 * 
 * Schema/modèle User
 *
 * @User
 */

const mongoose = require("mongoose");

//plugin uniqueValidator sert à ce qu'un utilisateur ne puisse pas se s"inscrire plusieurs fois avec la même adresse
const uniqueValidator = require("mongoose-unique-validator");

//La méthode  Schema  de Mongoose permet de créer un schéma de données pour votre base de données MongoDB.
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// on applique le validateur au schema avant d'en faire un modèle grâce a la méthode .plugin
userSchema.plugin(uniqueValidator);

//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("User", userSchema);
