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
        const grupo = await Grupo.findOne({ codigoGrupo }).lean();
        if (!grupo) {
            throw new Error('El grupo no existe o el código es inválido');
        }
        return grupo;
    }

    async agregarGastoAGrupo(codigoGrupo, datosGasto) {
        const { descripcion, monto, pagadoPor, divididoEntre } = datosGasto;

        const grupo = await Grupo.findOne({ codigoGrupo });
        if (!grupo) {
            const error = new Error('El grupo especificado no existe');
            error.statusCode = 404;
            throw error;
        }

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

module.exports = new GrupoService();
