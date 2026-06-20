const { z } = require('zod');

const reembolsarDeudaSchema = z.object({
    de: z.string().min(1, { message: 'Se debe especificar quién realiza el pago' }).trim(),
    a: z.string().min(1, { message: 'Se debe especificar quién recibe el pago' }).trim(),
    monto: z
        .number({ message: 'El monto debe ser un número válido' })
        .positive({ message: 'El monto a reembolsar debe ser mayor a 0' })
});

module.exports = { reembolsarDeudaSchema };
