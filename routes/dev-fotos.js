process.on('uncaughtException', err => {
  console.error('Excepción no atrapada:', err);
});
process.on('unhandledRejection', reason => {
  console.error('Promesa no manejada:', reason);
});
const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const router = express.Router();

router.get('/api/fotos', async (req, res) => {
  const gen = req.query.gen;
  if (!gen) {
    return res.status(400).json({ error: 'Falta el parámetro ?gen=' });
  }

  const originalDir = path.join(__dirname, '..', 'images', gen);
  const thumbDir = path.join(__dirname, '..', 'images', 'thumbnails', gen);

  try {
    const files = fs.readdirSync(originalDir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .filter(file => {
        try {
          const stats = fs.statSync(path.join(originalDir, file));
          return stats.size > 1000;
        } catch (err) {
          console.warn(`Archivo ilegible: ${file}`);
          return false;
        }
      });

    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }

    for (const file of files) {
      const input = path.join(originalDir, file);
      const output = path.join(thumbDir, file);

      if (fs.existsSync(output)) continue;

      try {
        console.log(`Intentando generar miniatura de ${file}`);
        await sharp(input)
         .resize({ width: 300 })
         .toFile(output);
        console.log(`Miniatura generada: ${file}`);

      } catch (err) {
        console.error(`Error con ${file}: ${err.message}`);
      }
    }

    const imagenes = files.map(file => ({
      thumb: `/images/thumbnails/${gen}/${encodeURIComponent(file)}`,
      full: `/images/${gen}/${encodeURIComponent(file)}`
    }));

    res.json(imagenes);
  } catch (err) {
    console.error('Error general:', err.message);
    res.status(500).json({ error: 'Error interno al procesar imágenes' });
  }
});

module.exports = router;
