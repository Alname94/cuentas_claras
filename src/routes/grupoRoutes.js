const express = require('express');
const router = express.Router();
const { crearGrupo } = require('../controllers/grupoController');

router.post('/', crearGrupo);

module.exports = router;