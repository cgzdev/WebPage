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
  console.log(`[SELECCION GUARDADA] ascii: ${req.body.ascii}, email: ${req.body.correo}, imagenes: ${req.body.imagenes}`);

  const { correo, ascii, imagenes } = req.body;

  // Validación mejorada
  console.log("BODY recibido:", req.body);
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correo?.trim() || !emailRegex.test(correo.trim())) {
    return res.status(400).json({ error: 'Correo electrónico inválido' });
  }
  
  if (!ascii?.trim() || !imagenes?.trim()) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Normalize all filenames to use _G for generation code
  const normalizedImagenes = imagenes.split(',').map(name => name.replace(/_g(\d{4})$/i, '_G$1')).join(',');

  //Guardar en archivo
  try {
    selecciones[ascii] = normalizedImagenes;
    fs.writeFileSync(dbPath, JSON.stringify(selecciones, null, 2));
    console.log(`[SELECCION GUARDADA] ascii: ${ascii}, email: ${correo}, imagenes: ${normalizedImagenes}`);
  } catch (err) {
    console.error(`[ERROR] No se pudo guardar la selección para ascii: ${ascii}`, err);
    return res.status(500).json({ error: 'No se pudo guardar la selección.' });
  }

  const link = `https://pinakothek60aniv.csm.edu.mx/${ascii}`;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'pinakothek60aniv@gmail.com',
        pass: process.env.EMAIL_PASS || 'kjto yjiw gpub xval'
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'pinakothek60aniv@gmail.com',
      to: correo,
      subject: 'Tu selección de fotos - Pinakothek60',
      text: `Durante seis décadas, hemos formado generaciones con espíritu crítico y pasión por el conocimiento.\nGracias por estar aquí, por revivir recuerdos, compartir sonrisas y, sobre todo, por impulsar juntos el próximo capítulo de nuestra historia.\n\nSu seleccion de fotos:\n${link}\n\n-Colegio Suizo de México`
    });

    res.json({ success: true, link });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    
    // Provide more specific error messages
    if (err.code === 'EAUTH') {
      res.status(500).json({ error: 'Error de autenticación del servidor de correo' });
    } else if (err.code === 'ECONNECTION') {
      res.status(500).json({ error: 'Error de conexión con el servidor de correo' });
    } else {
      res.status(500).json({ error: 'No se pudo enviar el correo. Intenta más tarde.' });
    }
  }
});

module.exports = router;
