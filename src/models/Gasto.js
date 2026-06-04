const mongoose = require('mongoose');

const GastoSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción del gasto es obligatoria'],
        trim: true
    },
    monto: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [0, 'El monto no puede ser negativo']
    },
    pagadoPor: {
        type: String,
        required: [true, 'Se debe especificar quién pagó']
    },
    divididoEntre: {
        type: [String],
        required: [true, 'Se debe especificar entre quiénes se divide']
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = GastoSchema;