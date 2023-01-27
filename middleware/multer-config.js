//npm install --save multer pour installer multer puis on le déclare avec un require.
const multer = require('multer');

// (dictionnaire)objet mime types. on peut maintenant créer l'éxtention l.19
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//création d'objet de configuration pour multer
const storage = multer.diskStorage({//diskStorage sert a enregistrer sur notre disk
  destination: (req, file, callback) => {// 2 élément requis en parametres : destination(fonction qui prends 3 arguments)
    //la requete le  file et le callback, la config de multer fonctionne comme sa
    callback(null, 'images');//on apelle le callback, dabord 'null' pour dire qu'il n'y a pas eu derreur et ensuite notre dossier image
  },
  filename: (req, file, callback) => {//2eme parametre de multer => filename
    const name = file.originalname.split(' ').join('_');// on crée son nom, originalname renvoie le nom dorigine, on split la chaine en tableau on remplace les espaces par des underscore
    const extension = MIME_TYPES[file.mimetype];//extention de notre dictionnaire qui correspong au mimetypes du fichier envoyé par le front end
    callback(null, name + Date.now() + '.' + extension);// on appelle le callback(argument 1 = null) et ensuite on crée le file name, auquel on crée un timestamp(pour le rendre)
    //le plus unique possible, Date.now ajoute un timestamp, on ajoute un point et lextension du fichier
  }
});

//exportation de notre middleware multer configurée, on lui passe notre objet storage . puis on utilise la méthode single pour 
//dire qu'il s'agit d'un fichier unique et non d'un groupe de fichier. 
// il s'agit d'images uniquement. 
module.exports = multer({storage: storage}).single('image');