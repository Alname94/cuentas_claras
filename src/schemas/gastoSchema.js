const { z } = require('zod');

const crearGastoSchema = z.object({
    descripcion: z.string().min(1, { message: 'La descripción del gasto es obligatoria' }).trim(),
    monto: z
        .number({ message: 'El monto es obligatorio y debe ser un número' })
        .positive({ message: 'El monto del gasto debe ser mayor a 0' }),
    pagadoPor: z.string().min(1, { message: 'Se debe especificar quién pagó el gasto' }).trim(),
    divididoEntre: z
        .array(z.string().trim())
        .min(1, { message: 'Se debe especificar al menos un participante para dividir el gasto' })
        .refine((arr) => new Set(arr).size === arr.length, {
            message: 'No puede haber participantes duplicados en la división del gasto'
        })
});

module.exports = { crearGastoSchema };
