const express = require('express');
const router = express.Router();
const ropaController = require('../controllers/ropaController');

router.get('/', ropaController.getAll);
router.get('/:id', ropaController.getById);
router.post('/', ropaController.create);
router.put('/:id', ropaController.update);
router.delete('/:id', ropaController.delete);
router.get('/categoria/:categoria', ropaController.getByCategoria);
router.patch('/stock/:id', ropaController.patchStock);

module.exports = router;