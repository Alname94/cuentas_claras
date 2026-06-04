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

module.exports = {
    crearGrupo
};