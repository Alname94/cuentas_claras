require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API lista' });
});

module.exports = app;