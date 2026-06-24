const authService = require('../services/authService');

const registrarUsuario = async (req, res, next) => {
    try {
        const resultado = await authService.registrar(req.body);
        res.status(201).json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

const loginUsuario = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const resultado = await authService.login(email, password);
        res.status(200).json({ success: true, data: resultado });
    } catch (error) {
        next(error);
    }
};

module.exports = { registrarUsuario, loginUsuario };
