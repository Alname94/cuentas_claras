const express = require('express');
const router = express.Router();
const {
    crearGrupo,
    getAllGrupos,
    getGrupoPorCodigo,
    crearGasto,
    calcularSaldos
} = require('../controllers/grupoController');

router.route('/').post(crearGrupo).get(getAllGrupos);

router.route('/:codigoGrupo').get(getGrupoPorCodigo);

router.route('/:codigoGrupo/gastos').post(crearGasto);

router.route('/:codigoGrupo/saldos').get(calcularSaldos);

module.exports = router;
