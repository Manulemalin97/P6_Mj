
/**
 * Définition de notre Serveur
 *
 * @Serveur
 */

//importation du package http de node (require permet d'importer)
const http = require("http");
// on importe app
const app = require("./app");
const dotenv = require("dotenv").config();

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//importer le package pour utiliser les variables d'envitonnement

//la fonction normalizePort renvoie un port valide
const port = normalizePort(process.env.PORT);

//parmamètrazge du port avec la méthode set de Express
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
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
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
