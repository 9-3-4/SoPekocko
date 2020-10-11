//pour enregistrer les images
const multer = require('multer');

//dictionnaire d extension, js 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//configuration
const storage = multer.diskStorage({                                  //pour signifier qu on va enregistrer les images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {                                //nom de fichier utilise
    const name = file.originalname.split(' ').join('_');              //non d origine avec _ pour remplacer les espaces
    const extension = MIME_TYPES[file.mimetype];                      //extension du fichier du dictionnaire qui correspond au fronted
    callback(null, name + Date.now() + '.' + extension);              //timestamp
  }
});

module.exports = multer({storage: storage}).single('image');