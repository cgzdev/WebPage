const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();
const paquetesDir = path.join(__dirname, '..', 'Images', 'paquetes');

//crea paquete y envía correo
router.post('/api/paquete', async (req, res) => {
  const { correo, imagenes } = req.body;

  if (!correo || !imagenes || !Array.isArray(imagenes) || imagenes.length === 0) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const paqueteID = `paquete_${crypto.randomBytes(4).toString('hex')}`;
  const paquetePath = path.join(paquetesDir, `${paqueteID}.json`);
  const downloadURL = `https://descarga.pinakothek60aniv.csm.edu.mx/?paquete=${paqueteID}`;

  try {
    fs.writeFileSync(paquetePath, JSON.stringify({ imagenes }), 'utf-8');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'fotos.generacion@csm.edu.mx',
        pass: 'GaraStudio#2025'
      }
    });

    const mailOptions = {
      from: 'Pinakothek 60 Años <fotos.generacion@csm.edu.mx>',
      to: correo,
      subject: 'Tu selección de fotos está lista',
      html: `
        <p>Hola,</p>
        <p>Has seleccionado algunas fotos de la galería Pinakothek 60 Años.</p>
        <p>Haz clic en el siguiente botón para descargarlas:</p>
        <p><a href="${downloadURL}" style="display:inline-block;padding:10px 20px;background:#007BFF;color:white;text-decoration:none;border-radius:5px;">Descargar mis fotos</a></p>
        <p>Este enlace expirará pronto. Gracias por participar.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${correo} con paquete ${paqueteID}`);

    res.json({ mensaje: 'Correo enviado con enlace de descarga' });
  } catch (err) {
    console.error('Error al guardar paquete o enviar correo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// obtener paquete JSON
router.get('/api/paquetes/:id', (req, res) => {
  const archivo = path.join(paquetesDir, `${req.params.id}.json`);
  if (!fs.existsSync(archivo)) {
    return res.status(404).json({ error: 'Paquete no encontrado' });
  }
  const data = fs.readFileSync(archivo, 'utf-8');
  res.json(JSON.parse(data));
});

// eliminar paquete
router.delete('/api/paquetes/:id', (req, res) => {
  const archivo = path.join(paquetesDir, `${req.params.id}.json`);
  if (!fs.existsSync(archivo)) {
    return res.status(404).json({ error: 'Paquete no encontrado' });
  }
  fs.unlinkSync(archivo);
  res.json({ mensaje: 'Paquete eliminado correctamente' });
});

module.exports = router;
