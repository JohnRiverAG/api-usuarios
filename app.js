// Punto de entrada

const express = require('express');
const bodyParser = require('body-parser');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/usuarios', usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
