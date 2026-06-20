const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const validateRequest = require('../middlewares/validateRequest');
const { crearGrupoSchema } = require('../schemas/grupoSchema');
const { crearGastoSchema } = require('../schemas/gastoSchema');

router.post('/', validateRequest(crearGrupoSchema), grupoController.crearGrupo);

router.route('/:codigoGrupo').get(grupoController.getGrupoPorCodigo);

router.post('/:codigoGrupo/gastos', validateRequest(crearGastoSchema), grupoController.crearGasto);

router.route('/:codigoGrupo/saldos').get(grupoController.calcularSaldos);

module.exports = router;
