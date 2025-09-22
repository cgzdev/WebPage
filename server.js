// Load environment variables (optional)
try {
  require('dotenv').config();
} catch (err) {
  console.log('dotenv not available, using default values');
}

const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const archiver = require('archiver');
const fs = require('fs');
const { selecciones } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images/zips', express.static(path.join(__dirname, 'images', 'zips')));
app.use('/images/maestros', express.static(path.join(__dirname, 'images', 'MAESTROS')));
app.use('/images/administracion', express.static(path.join(__dirname, 'images', 'ADMINISTRACION')));
app.use('/images/mantenimiento', express.static(path.join(__dirname, 'images', 'MANTENIMIENTO')));
app.use('/images/extraescolares', express.static(path.join(__dirname, 'images', 'GRUPOS_EXTRAESCOLARES')));
app.use('/images/thumbnails/maestros', express.static(path.join(__dirname, 'images', 'thumbnails', 'MAESTROS')));
app.use('/images/thumbnails/administracion', express.static(path.join(__dirname, 'images', 'thumbnails', 'ADMINISTRACION')));
app.use('/images/thumbnails/mantenimiento', express.static(path.join(__dirname, 'images', 'thumbnails', 'MANTENIMIENTO')));
app.use('/images/thumbnails/extraescolares', express.static(path.join(__dirname, 'images', 'thumbnails', 'GRUPOS_EXTRAESCOLARES')));
app.use(express.json());

// Rutas
const fotosDev = require('./routes/dev-fotos');
app.use(fotosDev);

const paqueteRouter = require('./routes/paquete');
app.use(paqueteRouter);

const userDataRouter = require('./routes/user-data');
app.use(userDataRouter);

// Función para determinar carpeta según nombre
function obtenerCarpeta(nombre) {
  if (nombre.toLowerCase().includes('maestros')) return 'maestros';
  if (nombre.toLowerCase().includes('administracion')) return 'administracion';
  if (nombre.toLowerCase().includes('mantenimiento')) return 'mantenimiento';
  if (nombre.toLowerCase().includes('extraescolares')) return 'extraescolares';

  // Match _G2027 or _g2027 at the end of the filename
  const match = nombre.match(/_G((19|20)\d{2})$/i);
  if (match) return match[1];

  return 'desconocido';
}

// Ruta para descarga de selección en ZIP
app.get('/:ascii', (req, res) => {
  const ascii = req.params.ascii;
  console.log(`[ZIP REQUEST] ascii: ${ascii}`);
  // Always read the latest selecciones.json from disk
  const seleccionesPath = path.join(__dirname, 'data', 'selecciones.json');
  let selecciones = {};
  if (fs.existsSync(seleccionesPath)) {
    try {
      selecciones = JSON.parse(fs.readFileSync(seleccionesPath, 'utf8'));
    } catch (e) {
      return res.status(500).send('Error leyendo la selección.');
    }
  }
  const string = selecciones[ascii];
  console.log(`[ZIP REQUEST] selection string: ${string}`);
  if (!string) {
    return res.status(404).send('No se encontró una selección para este código.');
  }
  const nombres = string.split(',').map(s => s.trim()).filter(Boolean);
  const zip = archiver('zip', { zlib: { level: 9 } });
  res.attachment('fotos_pinakothek.zip');
  zip.pipe(res);
  const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
  nombres.forEach(nombre => {
    const folder = obtenerCarpeta(nombre);
    let found = false;
    for (const ext of EXTENSIONS) {
      const filePath = path.join(__dirname, 'images', folder, nombre + ext);
      if (fs.existsSync(filePath)) {
        console.log(`[ZIP] Adding file: ${filePath}`);
        zip.file(filePath, { name: nombre + ext });
        found = true;
        break;
      }
    }
    if (!found) {
      console.warn(`[ZIP] Imagen no encontrada para: ${nombre} en carpeta ${folder}`);
    }
  });
  zip.finalize();
  // After sending the ZIP, delete the selection for this ascii
  zip.on('end', () => {
    try {
      delete selecciones[ascii];
      fs.writeFileSync(seleccionesPath, JSON.stringify(selecciones, null, 2));
      console.log(`[ZIP CLEANUP] Selección eliminada para ascii: ${ascii}`);
    } catch (e) {
      console.error(`[ZIP CLEANUP] Error eliminando selección para ascii: ${ascii}`, e);
    }
  });
});

// Inicio del servidor
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Servidor Node escuchando en http://127.0.0.1:${PORT} (detrás de Nginx)`);
});
