const { z } = require('zod');

const registroSchema = z.object({
    nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }).trim(),
    email: z.string().email({ message: 'Debe ser un email válido' }).trim(),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

const loginSchema = z.object({
    email: z.string().email({ message: 'Debe ser un email válido' }).trim(),
    password: z.string().min(1, { message: 'La contraseña es obligatoria' })
});

module.exports = { registroSchema, loginSchema };
