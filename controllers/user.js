const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//on importe notre model User
const User = require("../models/User");

exports.signup = (req, res, next) => {
  console.log("signup");
  bcrypt//cryptage du mdp
    .hash(req.body.password, 10)//hashage du mdp
    .then((hash) => {
      console.log("bcrypt:"+ hash);
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
console.log('utilisateur crée !')
        res.status(201).json({ message: "Utilisateur créé !" })
      }
        )
        
        .catch((error) => {
          console.log("error:" + error)
          res.status(400).json({ error })
          }
          );
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  console.log("login");
  User.findOne({ email: req.body.email })
 
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
             userId: user._id,
             token: jwt.sign(
              { userId: user._id }, 
             'RANDOM_TOKEN_SECRET', {
             expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

