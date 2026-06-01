const app = require('./app');
const PORT = process.env.PORT;
const connectDB = require('./config/db');

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo arrancar el servidor debido a un fallo inicial:', error.message);
    }
};

startServer();