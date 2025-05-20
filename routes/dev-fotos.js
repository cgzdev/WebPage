const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/api/fotos', (req, res) => {
  const folderPath = path.join(__dirname, '..', 'images', 'originales');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer la carpeta' });
    }

    const imagenes = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/images/originales/${encodeURIComponent(file)}`);
    res.json(imagenes);
  });
});

module.exports = router;
