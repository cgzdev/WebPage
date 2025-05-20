const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Ruta temporal para desarrollo
if (process.env.NODE_ENV !== 'production') {
  const fotosDev = require('./routes/dev-fotos');
  app.use('/images', express.static(path.join(__dirname, 'images')));
}

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
