const grupoService = require('../services/grupoService');

const crearGrupo = async (req, res, next) => {
    try {
        const nuevoGrupo = await grupoService.crearGrupo(req.body);
        res.status(201).json({ success: true, data: nuevoGrupo });
    } catch (error) {
        next(error);
    }
};

const getAllGrupos = async (req, res, next) => {
    try {
        const grupos = await grupoService.obtenerTodosLosGrupos();
        res.status(200).json({ success: true, count: grupos.length, data: grupos });
    } catch (error) {
        next(error);
    }
};

const getGrupoPorCodigo = async (req, res, next) => {
    try {
        const grupo = await grupoService.obtenerPorCodigo(req.params.codigoGrupo);
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        next(error);
    }
};

const eliminarGrupo = async (req, res, next) => {
    try {
        const resultado = await grupoService.eliminarGrupo(req.params.codigoGrupo);
        res.status(200).json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const crearGasto = async (req, res, next) => {
    try {
        const gastoGuardado = await grupoService.agregarGastoAGrupo(
            req.params.codigoGrupo,
            req.body
        );
        res.status(201).json({
            success: true,
            message: 'Gasto agregado correctamente',
            data: gastoGuardado
        });
    } catch (error) {
        next(error);
    }
};

const calcularSaldos = async (req, res, next) => {
    try {
        const saldos = await grupoService.calcularSaldos(req.params.codigoGrupo);
        res.status(200).json({ success: true, data: saldos });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    crearGrupo,
    getAllGrupos,
    getGrupoPorCodigo,
    eliminarGrupo,
    crearGasto,
    calcularSaldos
};
