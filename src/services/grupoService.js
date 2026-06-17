const Grupo = require('../models/Grupo');
const crypto = require('crypto');

class GrupoService {
    async crearGrupo(datosGrupo) {
        const { nombre, moneda, participantes } = datosGrupo;

        const codigoGrupo = crypto.randomBytes(3).toString('hex');

        const nuevoGrupo = new Grupo({
            nombre,
            moneda,
            participantes,
            codigoGrupo
        });

        return await nuevoGrupo.save();
    }

    async obtenerTodosLosGrupos() {
        return await Grupo.find().select('-gastos -updatedAt').lean();
    }

    async obtenerPorCodigo(codigoGrupo) {
        return await buscarGrupo(codigoGrupo, true);
    }

    async agregarGastoAGrupo(codigoGrupo, datosGasto) {
        let { descripcion, monto, pagadoPor, divididoEntre } = datosGasto;

        monto = Math.round(monto * 100) / 100;

        const grupo = await buscarGrupo(codigoGrupo);

        if (!grupo.participantes.includes(pagadoPor)) {
            const error = new Error(
                `La persona que pagó (${pagadoPor}) no pertenece a este grupo.`
            );
            error.statusCode = 400;
            throw error;
        }

        const todosParticipan = divididoEntre.every((p) => grupo.participantes.includes(p));
        if (!todosParticipan) {
            const error = new Error(
                'Uno o más participantes en "divididoEntre" no pertenecen a este grupo.'
            );
            error.statusCode = 400;
            throw error;
        }

        const nuevoGasto = { descripcion, monto, pagadoPor, divididoEntre };
        grupo.gastos.push(nuevoGasto);

        await grupo.save();

        return grupo.gastos[grupo.gastos.length - 1];
    }
}

async function buscarGrupo(codigoGrupo, conLean = false) {
    let query = Grupo.findOne({ codigoGrupo });

    if (conLean) {
        query = query.lean();
    }

    const grupo = await query;

    if (!grupo) {
        const error = new Error('El grupo especificado no existe o el código es inválido');
        error.statusCode = 404;
        throw error;
    }

    return grupo;
}

module.exports = new GrupoService();
