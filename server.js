const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const archiver = require('archiver');
const fs = require('fs');
const { selecciones } = require('./data');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images/zips', express.static(path.join(__dirname, 'images', 'zips')));
app.use(express.json());

// Rutas
const fotosDev = require('./routes/dev-fotos');
app.use(fotosDev);

const paqueteRouter = require('./routes/paquete');
app.use(paqueteRouter);

// Función para determinar carpeta según nombre
function obtenerCarpeta(nombre) {
  if (nombre.includes('maestros')) return 'maestros';
  if (nombre.includes('administracion')) return 'administracion';
  if (nombre.includes('mantenimiento')) return 'mantenimiento';
  if (nombre.includes('extraescolares')) return 'grupos_extraescolares';

  const match = nombre.match(/g(19|20)\d{2}/);
  if (match) return match[0].replace('g', '');

  return 'desconocido';
}

// Ruta para descarga de selección en ZIP
app.get('/:ascii', (req, res) => {
  const ascii = req.params.ascii;
  const string = selecciones[ascii];

  if (!string) {
    return res.status(404).send('No se encontró una selección para este código.');
  }

  const nombres = string.split(',');
  const zip = archiver('zip', { zlib: { level: 9 } });

  res.attachment('fotos_pinakothek.zip');
  zip.pipe(res);

  nombres.forEach(nombre => {
    const folder = obtenerCarpeta(nombre);
    const filePath = path.join(__dirname, 'images', folder, nombre + '.jpg');

    if (fs.existsSync(filePath)) {
      zip.file(filePath, { name: nombre + '.jpg' });
    } else {
      console.warn(`Imagen no encontrada: ${filePath}`);
    }
  });

  zip.finalize();
});

// Inicio del servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor accesible en http://pinakothek60aniv.csm.edu.mx/`);
});
