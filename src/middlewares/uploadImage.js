const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    console.log("Subiendo archivo:", file.originalname);

    return {
      folder: 'prendas',
      format: file.mimetype.split('/')[1], 
      public_id: Date.now() + '-' + file.originalname
    };
  }
});

const upload = multer({
  storage: storage
});

module.exports = upload;