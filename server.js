/**
 *  server.js
 *  Création et démarrage de notre serveur
 *
 *  @author : Manuel JANSEN
 *  @version : 1.0
 *  @ date : 2023-02
 *
 **/

/**
 * Définition de notre Serveur
 *
 * @Serveur
 */

//importation du package http de node (require permet d'importer)
const http = require("http"); // et crée un serveur HTTP en utilisant le module http. Cela permet d'écouter les requêtes HTTP entrantes et de les acheminer vers l'application Express.
// on importe app
const app = require("./app"); // on importe le module app depuis le fichier app.js
const dotenv = require("dotenv").config(); // permet de charger les variables d'environnement à partir du fichier .env

//Cette fonction permet de normaliser un port en une valeur numérique
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  //Si la valeur fournie n'est pas un nombre, ou si elle est inférieure à 0, la fonction retourne false.
  if (isNaN(port) || typeof port !== "number") {
    return false;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//importer le package pour utiliser les variables d'envitonnement

//la fonction normalizePort renvoie un port valide
const port = normalizePort(process.env.PORT);

//parmamètrage du port avec la méthode set de Express
app.set("port", port);

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES": //Si l'erreur est de type "EACCES", cela signifie que l'application nécessite des privilèges élevés
      console.error(bind + " requires elevated privileges.");
      process.exit(1); //Dans ce cas, la fonction affiche un message d'erreur et quitte le processus avec le code de sortie 1.
      break;
    case "EADDRINUSE": //Si l'erreur est de type "EADDRINUSE", cela signifie que le port ou l'adresse spécifiée est déjà utilisé par un autre processus.
      console.error(bind + " is already in use.");
      process.exit(1); //Dans ce cas, la fonction affiche un message d'erreur et quitte le processus avec le code de sortie 1.
      break;
    default:
      throw error;
  }
};
//const qui permet de créer le serveur, méthode create server de la méthode http, en argument la fonction qui sera appellé à chaque fois qu'une requête
//est faite au serveur
const server = http.createServer(app);

// un écouteur d'évènements est également enregistré
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
