const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const protegerRuta = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new Error('No autorizado, no se proporcionó un token.');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = await Usuario.findById(decodificado.id).select('-password');

        if (!req.usuario) {
            const error = new Error('El usuario de este token ya no existe.');
            error.statusCode = 401;
            return next(error);
        }

        next();
    } catch (error) {
        error.message = 'No autorizado, token inválido o expirado.';
        error.statusCode = 401;
        next(error);
    }
};

module.exports = protegerRuta;
