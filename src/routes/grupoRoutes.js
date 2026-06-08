const express = require('express');
const router = express.Router();
const { crearGrupo, getAllGrupos, getGrupoPorCodigo } = require('../controllers/grupoController');

router.route('/')
    .post(crearGrupo)
    .get(getAllGrupos);

router.route('/:codigoGrupo')
    .get(getGrupoPorCodigo);

module.exports = router;