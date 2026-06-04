const mongoose = require('mongoose');
const GastoSchema = require('./Gasto');

const GrupoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del grupo es obligatorio'],
        trim: true
    },
    codigoGrupo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    moneda: {
        type: String,
        required: [true, 'El tipo de moneda es obligatorio'],
        default: 'ARS',
        uppercase: true,
        trim: true,
        minLength: 3,
        maxLength: 3
    },
    participantes: {
        type: [String],
        validate: [(value) => value.length >= 1, 'El grupo debe tener al menos un participante']
    },
    gastos: [GastoSchema]
},
    {
        timestamps: true,
        versionKey: false
    }

);

module.exports = mongoose.model('Grupo', GrupoSchema);