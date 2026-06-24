const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { registroSchema, loginSchema } = require('../schemas/authSchema');

router.post('/register', validateRequest(registroSchema), authController.registrarUsuario);
router.post('/login', validateRequest(loginSchema), authController.loginUsuario);

module.exports = router;
