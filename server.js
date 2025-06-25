const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

const fotosDev = require('./routes/dev-fotos');
app.use(fotosDev);

const paqueteRouter = require('./routes/paquete');
app.use(paqueteRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor accesible en http://pinakothek60aniv.csm.edu.mx/`);
});

app.use('/Images/zips', express.static(path.join(__dirname, 'Images', 'zips')));
