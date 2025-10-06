const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notes.js');

// Note routes
router.post('/register', noteController.create);
router.get('/', noteController.getAll);
router.get('/user/:user_id', noteController.getAllByUser);
router.get('/:id', noteController.getById);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

module.exports = router;