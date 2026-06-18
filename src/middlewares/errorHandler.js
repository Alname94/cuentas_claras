const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    let mensajePublico = err.message;

    if (statusCode === 500) {
        console.error('ERROR INTERNO:', err);

        mensajePublico = 'Ocurrió un error interno en el servidor. Inténtelo más tarde.';
    }

    res.status(statusCode).json({
        success: false,
        error: mensajePublico
    });
};

module.exports = errorHandler;
