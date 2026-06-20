const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const validateRequest = require('../middlewares/validateRequest');
const { crearGrupoSchema } = require('../schemas/grupoSchema');

router.post('/', validateRequest(crearGrupoSchema), grupoController.crearGrupo);

router.route('/:codigoGrupo').get(grupoController.getGrupoPorCodigo);

router.route('/:codigoGrupo/gastos').post(grupoController.crearGasto);

router.route('/:codigoGrupo/saldos').get(grupoController.calcularSaldos);

module.exports = router;
