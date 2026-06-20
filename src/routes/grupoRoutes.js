const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupoController');
const validateRequest = require('../middlewares/validateRequest');
const { crearGrupoSchema } = require('../schemas/grupoSchema');
const { crearGastoSchema } = require('../schemas/gastoSchema');
const { reembolsarDeudaSchema } = require('../schemas/reembolsarDeudaSchema');

router
    .route('/')
    .get(grupoController.getAllGrupos)
    .post(validateRequest(crearGrupoSchema), grupoController.crearGrupo);

router
    .route('/:codigoGrupo')
    .get(grupoController.getGrupoPorCodigo)
    .delete(grupoController.eliminarGrupo);

router.post('/:codigoGrupo/gastos', validateRequest(crearGastoSchema), grupoController.crearGasto);

router
    .route('/:codigoGrupo/saldos')
    .get(grupoController.calcularSaldos)
    .post(validateRequest(reembolsarDeudaSchema), grupoController.reembolsarDeuda);

module.exports = router;
