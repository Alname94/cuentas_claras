const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conexion = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Conectado: ${conexion.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar a MongoDB: ${error.message}`);
        // Cerrar el proceso con fallo (1) si no nos podemos conectar a la base de datos
        process.exit(1);
    }
};

module.exports = connectDB;