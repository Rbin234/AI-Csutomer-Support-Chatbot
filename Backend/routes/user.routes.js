const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');


// Routes
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.get('/:id', verifyToken , userController.getUserById);

module.exports = router;
