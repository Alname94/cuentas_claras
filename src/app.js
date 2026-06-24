require('dotenv').config();
const express = require('express');
const app = express();
const grupoRoutes = require('./routes/grupoRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.use('/api/grupos', grupoRoutes);
app.use('/api/usuario', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API lista' });
});

app.use(errorHandler);

module.exports = app;
