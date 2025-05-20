const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

const fotosDev = require('./routes/dev-fotos');
app.use(fotosDev);

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});