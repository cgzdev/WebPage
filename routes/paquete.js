const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();
const dbPath = path.join(__dirname, '../data/selecciones.json');

// Asegura que exista la carpeta /data
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath));
}

// Carga o inicia la base de datos
let selecciones = {};
if (fs.existsSync(dbPath)) {
  selecciones = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Endpoint principal
router.post('/api/paquete', async (req, res) => {
  // 🔍 LOG para depurar
  console.log('POST /api/paquete body:', req.body);

  const { correo, ascii, imagenes } = req.body;

  // Validación mejorada
console.log("BODY recibido:", req.body);
if (!correo?.trim() || !ascii?.trim() || !imagenes?.trim()) {
  return res.status(400).json({ error: 'Faltan datos requeridos' });
}


 //Guardar en archivo
  selecciones[ascii] = imagenes;
  fs.writeFileSync(dbPath, JSON.stringify(selecciones, null, 2));

  const link = `https://pinakothek60aniv.csm.edu.mx/${ascii}`;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pinakothek60aniv@gmail.com',
        pass: 'kjto yjiw gpub xval'
      }
    });

    await transporter.sendMail({
      from: 'pinakothek60aniv@gmail.com',
      to: correo,
      subject: 'Tu selección de fotos - Pinakothek60',
      text: `Gracias por usar la Pinacoteca. Aquí está el enlace con tu selección:\n\n${link}`
    });

    res.json({ success: true, link });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});

module.exports = router;
