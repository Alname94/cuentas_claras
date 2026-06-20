const { z } = require('zod');

const crearGrupoSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre del grupo es obligatorio' }).trim(),
    moneda: z
        .string()
        .trim()
        .toUpperCase()
        .length(3, { message: 'El tipo de moneda debe tener exactamente 3 caracteres (ej: ARS)' }),
    participantes: z
        .array(z.string().trim())
        .min(2, { message: 'El grupo debe tener al menos 2 participantes para dividir gastos' })
        .refine((arr) => new Set(arr).size === arr.length, {
            message: 'Los nombres de los participantes no pueden estar duplicados'
        })
});

module.exports = { crearGrupoSchema };
