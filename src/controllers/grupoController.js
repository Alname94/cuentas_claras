const { default: mongoose } = require('mongoose');
const Grupo = require('../models/Grupo');
const crypto = require('crypto');

const crearGrupo = async (req, res) => {
    try {
        const { nombre, moneda, participantes } = req.body;

        const codigoGrupo = crypto.randomBytes(3).toString('hex');

        const nuevoGrupo = new Grupo({
            nombre,
            moneda,
            participantes,
            codigoGrupo
        });

        const grupoGuardado = await nuevoGrupo.save();

        res.status(201).json({
            success: true,
            data: grupoGuardado
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getAllGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.find()
            .select('-gastos -updatedAt')
            .lean();

        res.status(200).json({
            success: true,
            count: grupos.length,
            data: grupos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener los grupos de la base de datos'
        });
    }
};

const getGrupoPorCodigo = async (req, res) => {

    try {
        const { codigoGrupo } = req.params;

        const grupo = await Grupo.findOne({ codigoGrupo }).lean();

        if (!grupo) {
            return res.status(404).json({
                success: false,
                error: 'El grupo no existe o el código es inválido'
            });
        }

        res.status(200).json({
            success: true,
            data: grupo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error interno al buscar el grupo'
        });
    }
}

module.exports = {
    crearGrupo, getAllGrupos, getGrupoPorCodigo
};