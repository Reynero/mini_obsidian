

const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.js');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:id', userController.getProfile);
router.get('/', userController.getAllUsers);
console.log(Object.keys(userController) + "AAAHH")
module.exports = router;