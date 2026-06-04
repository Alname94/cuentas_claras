require('dotenv').config();
const express = require('express');
const app = express();

const grupoRoutes = require('./routes/grupoRoutes');

app.use(express.json());

app.use('/api/grupos', grupoRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API lista' });
});

module.exports = app;