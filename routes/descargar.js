const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/api/descargar', async (req, res) => {
  const { gen, imagenes, correo } = req.body;

  if (!gen || !Array.isArray(imagenes) || imagenes.length === 0 || !correo) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const zipName = `seleccion_${Date.now()}.zip`;
  const zipPath = path.join(__dirname, '..', 'Images', 'zips', zipName);
  const downloadURL = `https://pinakothek60aniv.csm.edu.mx/Images/zips/${zipName}`;

  try {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    for (const nombre of imagenes) {
      const ruta = path.join(__dirname, '..', 'Images', 'originales', gen, nombre);
      if (fs.existsSync(ruta)) {
        archive.file(ruta, { name: nombre });
      } else {
        console.warn(`Imagen no encontrada: ${ruta}`);
      }
    }

    await archive.finalize();

    output.on('close', async () => {
      // Configura el transporte con tu correo institucional
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
        from: '"Galería CSM" <fotos.generacion@csm.edu.mx>',
        to: correo,
        subject: 'Tu selección de fotos está lista',
        html: `
          <p>Hola,</p>
          <p>Tu selección de imágenes ya está disponible. Puedes descargarla en el siguiente enlace:</p>
          <p><a href="${downloadURL}">${downloadURL}</a></p>
          <p>Este enlace estará disponible por 24 horas.</p>
          <br/>
          <p>Gracias por ser parte de nuestra generación,</p>
          <p><strong>Pinakothek 60 Aniversario</strong></p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${correo} con ZIP ${zipName}`);

      res.json({ mensaje: 'Correo enviado con el enlace de descarga' });

      // Eliminación automática después de 24h
      setTimeout(() => {
        fs.unlink(zipPath, err => {
          if (err) console.error(`No se pudo borrar el ZIP: ${zipPath}`);
          else console.log(`ZIP eliminado automáticamente: ${zipName}`);
        });
      }, 24 * 60 * 60 * 1000);
    });

  } catch (error) {
    console.error('Error general:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

