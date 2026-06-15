const express = require('express');
const router = express.Router();
const {
    crearGrupo,
    getAllGrupos,
    getGrupoPorCodigo,
    crearGasto
} = require('../controllers/grupoController');

router.route('/').post(crearGrupo).get(getAllGrupos);

router.route('/:codigoGrupo').get(getGrupoPorCodigo);

router.route('/:codigoGrupo/gastos').post(crearGasto);

module.exports = router;
