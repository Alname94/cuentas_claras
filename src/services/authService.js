const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const generarToken = (usuarioId) => {
    return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

async function registrar(datosUsuario) {
    const { email } = datosUsuario;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        const error = new Error('El email ya está registrado.');
        error.statusCode = 400;
        throw error;
    }

    const nuevoUsuario = new Usuario(datosUsuario);
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario._id);
    return {
        usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email },
        token
    };
}

async function login(email, password) {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error('Credenciales inválidas.');
        error.statusCode = 401;
        throw error;
    }

    const esCorrecto = await usuario.comprobarPassword(password);
    if (!esCorrecto) {
        const error = new Error('Credenciales inválidas.');
        error.statusCode = 401;
        throw error;
    }

    const token = generarToken(usuario._id);
    return {
        usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
        token
    };
}

module.exports = { registrar, login };
