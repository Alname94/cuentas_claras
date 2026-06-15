const grupoService = require('../services/grupoService');

const crearGrupo = async (req, res) => {
    try {
        const nuevoGrupo = await grupoService.crearGrupo(req.body);
        res.status(201).json({ success: true, data: nuevoGrupo });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getAllGrupos = async (req, res) => {
    try {
        const grupos = await grupoService.obtenerTodosLosGrupos();
        res.status(200).json({ success: true, count: grupos.length, data: grupos });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener los grupos' });
    }
};

const getGrupoPorCodigo = async (req, res) => {
    try {
        const grupo = await grupoService.obtenerPorCodigo(req.params.codigoGrupo);
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const crearGasto = async (req, res) => {
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
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ success: false, error: error.message });
    }
};

module.exports = {
    crearGrupo,
    getAllGrupos,
    getGrupoPorCodigo,
    crearGasto
};
