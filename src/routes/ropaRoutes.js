const express = require('express');
const router = express.Router();
const ropaController = require('../controllers/ropaController');
const upload = require('../middlewares/uploadImage'); 

router.get('/', ropaController.getAll);
router.get('/categoria/:categoria', ropaController.getByCategoria);
router.post('/', upload.single('imagen'), ropaController.create);
router.put('/:id', upload.single('imagen'), ropaController.update);
router.get('/:id', ropaController.getById);
router.delete('/:id', ropaController.delete);
router.patch('/stock/:id', ropaController.patchStock);

module.exports = router;