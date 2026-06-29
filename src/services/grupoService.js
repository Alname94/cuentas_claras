const Grupo = require('../models/Grupo');
const crypto = require('crypto');

class GrupoService {
    async crearGrupo(datosGrupo, usuarioId) {
        const { nombre, moneda, participantes } = datosGrupo;

        const codigoGrupo = crypto.randomBytes(3).toString('hex');
        const creador = usuarioId;
        const nuevoGrupo = new Grupo({
            nombre,
            moneda,
            participantes,
            creador,
            codigoGrupo
        });

        return await nuevoGrupo.save();
    }

    async obtenerTodosLosGruposDelUsuario(usuarioId) {
        return await Grupo.find({ creador: usuarioId }).select('-gastos -updatedAt').lean();
    }

    async obtenerPorCodigo(creador, codigoGrupo) {
        return await buscarGrupo(creador, codigoGrupo, true);
    }

    async eliminarGrupo(creador, codigoGrupo) {
        const grupo = await buscarGrupo(creador, codigoGrupo);
        await grupo.deleteOne();
        return { message: `El grupo ${grupo.nombre} fue eliminado con éxito.` };
    }

    async agregarGastoAGrupo(creador, codigoGrupo, datosGasto) {
        let { descripcion, monto, pagadoPor, divididoEntre } = datosGasto;

        monto = Math.round(monto * 100) / 100;

        const grupo = await buscarGrupo(creador, codigoGrupo);

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

        const gastoInstancia = grupo.gastos.create({
            descripcion,
            monto,
            pagadoPor,
            divididoEntre
        });
        grupo.gastos.push(gastoInstancia);

        await grupo.save();

        return gastoInstancia;
    }

    /**
     * Calcula los saldos netos de cada participante en un grupo, así como las deudas simplificadas para saldar el grupo.
     * @param {string} codigoGrupo El código del grupo para el cual se quieren calcular los saldos
     * @returns Un objeto con los totales pagados por cada participante, sus balances netos y las deudas simplificadas para saldar el grupo
     */
    async calcularSaldos(creador, codigoGrupo) {
        const grupo = await buscarGrupo(creador, codigoGrupo, true);

        const { totales, balances } = calcularBalancesNetos(grupo.participantes, grupo.gastos);
        const deudasSimplificadas = simplificarDeudas(grupo.participantes, balances);

        return { totales, balances, deudasSimplificadas };
    }

    async reembolsarDeuda(creador, codigoGrupo, datosPago) {
        const { de, a, monto } = datosPago;
        const grupo = await buscarGrupo(creador, codigoGrupo);

        // Validar que ambos participantes existan en este grupo específico
        if (!grupo.participantes.includes(de) || !grupo.participantes.includes(a)) {
            const error = new Error('Uno o ambos participantes no pertenecen a este grupo.');
            error.statusCode = 400;
            throw error;
        }

        // Crear un registro especial dentro del array de gastos
        const pagoInstancia = grupo.gastos.create({
            descripcion: `Liquidación: ${de} ➡️ ${a}`,
            monto: Math.round(monto * 100) / 100,
            pagadoPor: de,
            divididoEntre: [a] // Al dividirse solo entre 'a', el sistema netea el balance entre ambos
        });

        grupo.gastos.push(pagoInstancia);
        await grupo.save();

        return pagoInstancia;
    }
}

async function buscarGrupo(creador, codigoGrupo, conLean = false) {
    let query = Grupo.findOne({ creador, codigoGrupo });

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

function calcularBalancesNetos(participantes, gastos) {
    const totales = {};
    const balances = {};

    // Inicializar totales y balances para cada participante
    participantes.forEach((p) => {
        totales[p] = 0;
        balances[p] = 0;
    });

    gastos.forEach((gasto) => {
        const { monto, pagadoPor, divididoEntre } = gasto;

        // El participante que pagó el gasto suma el monto total a su total
        if (totales[pagadoPor] !== undefined) totales[pagadoPor] += monto;

        // Cada participante en "divididoEntre" debe su parte proporcional del gasto
        const cuotaParte = monto / divididoEntre.length;
        divididoEntre.forEach((p) => {
            if (balances[p] !== undefined) balances[p] -= cuotaParte;
        });
    });

    // Calcular el balance neto para cada participante sumando lo que pagó y restando lo que debe
    participantes.forEach((p) => {
        let balanceRedondeado = Math.round((balances[p] + totales[p]) * 100) / 100;

        // tolerancia UX: Si el residuo es de 1 o 2 centavos (positivo o negativo), lo limpiamos a 0
        if (Math.abs(balanceRedondeado) <= 0.02) {
            balanceRedondeado = 0;
        }
        balances[p] = balanceRedondeado;
    });

    return { totales, balances };
}

function simplificarDeudas(participantes, balances) {
    // Crear listas de deudores y acreedores
    let deudores = participantes
        .map((p) => ({ persona: p, saldo: balances[p] }))
        .filter((x) => x.saldo < 0)
        .sort((a, b) => a.saldo - b.saldo);

    let acreedores = participantes
        .map((p) => ({ persona: p, saldo: balances[p] }))
        .filter((x) => x.saldo > 0)
        .sort((a, b) => b.saldo - a.saldo);

    const transferencias = [];
    let i = 0, // Índice para deudores
        j = 0; // Índice para acreedores

    // Mientras haya deudores y acreedores pendientes
    while (i < deudores.length && j < acreedores.length) {
        let deudor = deudores[i];
        let acreedor = acreedores[j];

        // El monto a transferir es el mínimo entre lo que debe el deudor y lo que tiene el acreedor
        let montoTransferencia = Math.min(Math.abs(deudor.saldo), acreedor.saldo);
        montoTransferencia = Math.round(montoTransferencia * 100) / 100;

        if (montoTransferencia > 0) {
            transferencias.push({
                de: deudor.persona,
                a: acreedor.persona,
                monto: montoTransferencia
            });
        }

        // Simular la transferencia para actualizar los saldos y avanzar en las listas
        deudor.saldo = Math.round((deudor.saldo + montoTransferencia) * 100) / 100;
        acreedor.saldo = Math.round((acreedor.saldo - montoTransferencia) * 100) / 100;

        if (deudor.saldo === 0) i++;
        if (acreedor.saldo === 0) j++;
    }

    return transferencias;
}

module.exports = new GrupoService();
