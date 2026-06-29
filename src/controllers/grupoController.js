const grupoService = require('../services/grupoService');

const crearGrupo = async (req, res, next) => {
    try {
        const { id: usuarioId } = req.usuario;
        const nuevoGrupo = await grupoService.crearGrupo(req.body, usuarioId);
        res.status(201).json({ success: true, data: nuevoGrupo });
    } catch (error) {
        next(error);
    }
};

const getAllGruposPorUsuario = async (req, res, next) => {
    try {
        const { id: usuarioId } = req.usuario;
        const grupos = await grupoService.obtenerTodosLosGruposDelUsuario(usuarioId);
        res.status(200).json({ success: true, count: grupos.length, data: grupos });
    } catch (error) {
        next(error);
    }
};

const getGrupoPorCodigo = async (req, res, next) => {
    try {
        const { id: usuarioId } = req.usuario;
        const { codigoGrupo } = req.params;
        const grupo = await grupoService.obtenerPorCodigo(usuarioId, codigoGrupo);
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        next(error);
    }
};

const eliminarGrupo = async (req, res, next) => {
    try {
        const { id: usuarioId } = req.usuario;
        const { codigoGrupo } = req.params;
        const resultado = await grupoService.eliminarGrupo(usuarioId, codigoGrupo);
        res.status(200).json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const crearGasto = async (req, res, next) => {
    try {
        const { id: usuarioId } = req.usuario;
        const { codigoGrupo } = req.params;
        const gastoGuardado = await grupoService.agregarGastoAGrupo(
            usuarioId,
            codigoGrupo,
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
        const { id: usuarioId } = req.usuario;
        const { codigoGrupo } = req.params;
        const saldos = await grupoService.calcularSaldos(usuarioId, codigoGrupo);
        res.status(200).json({ success: true, data: saldos });
    } catch (error) {
        next(error);
    }
};

const reembolsarDeuda = async (req, res, next) => {
    try {
        const { id: usuarioId } = req.usuario;
        const { codigoGrupo } = req.params;
        const transferencia = await grupoService.reembolsarDeuda(usuarioId, codigoGrupo, req.body);
        res.status(200).json({ success: true, data: transferencia });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    crearGrupo,
    getAllGruposPorUsuario,
    getGrupoPorCodigo,
    eliminarGrupo,
    crearGasto,
    calcularSaldos,
    reembolsarDeuda
};
