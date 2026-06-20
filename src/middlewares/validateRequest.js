/**
 * Middleware para validar el body de la petición usando un esquema de Zod
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error && Array.isArray(error.issues)) {
                const erroresMapeados = error.issues.map((err) => err.message).join(', ');

                const customError = new Error(erroresMapeados);
                customError.statusCode = 400;

                return next(customError);
            }

            next(error);
        }
    };
};

module.exports = validateRequest;
