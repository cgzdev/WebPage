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

// Email templates for different languages
const emailTemplates = {
  es: {
    subject: 'Tu selección de fotos - Pinakothek60',
    text: `Durante seis décadas, hemos formado generaciones con espíritu crítico y pasión por el conocimiento.\nGracias por estar aquí, por revivir recuerdos, compartir sonrisas y, sobre todo, por impulsar juntos el próximo capítulo de nuestra historia.\n\nSu seleccion de fotos:\n{link}\n\n-Colegio Suizo de México \n Desarrollado por: Arturo Robles, Carlos Galindo, Federico Aguilar, Yan Alvarez`
  },
  en: {
    subject: 'Your photo selection - Pinakothek60',
    text: `For six decades, we have formed generations with critical spirit and passion for knowledge.\nThank you for being here, for reliving memories, sharing smiles and, above all, for driving together the next chapter of our history.\n\nYour photo selection:\n{link}\n\n-Swiss School of Mexico \n Developed by: Arturo Robles, Carlos Galindo, Federico Aguilar, Yan Alvarez`
  },
  de: {
    subject: 'Ihre Fotoauswahl - Pinakothek60',
    text: `Sechs Jahrzehnte lang haben wir Generationen mit kritischem Geist und Leidenschaft für Wissen geformt.\nDanke, dass Sie hier sind, um Erinnerungen zu beleben, Lächeln zu teilen und vor allem, um gemeinsam das nächste Kapitel unserer Geschichte voranzutreiben.\n\nIhre Fotoauswahl:\n{link}\n\n-Schweizer Schule Mexiko \n Entwickelt von: Arturo Robles, Carlos Galindo, Federico Aguilar, Yan Alvarez`
  },
  fr: {
    subject: 'Votre sélection de photos - Pinakothek60',
    text: `Pendant six décennies, nous avons formé des générations avec un esprit critique et une passion pour la connaissance.\nMerci d'être ici, de revivre les souvenirs, de partager les sourires et, surtout, de propulser ensemble le prochain chapitre de notre histoire.\n\nVotre sélection de photos:\n{link}\n\n-École Suisse du Mexique \n Développé par: Arturo Robles, Carlos Galindo, Federico Aguilar, Yan Alvarez`
  }
};

// Endpoint principal
router.post('/api/paquete', async (req, res) => {
  // 🔍 LOG para depurar
  console.log('POST /api/paquete body:', req.body);
  console.log(`[SELECCION GUARDADA] ascii: ${req.body.ascii}, email: ${req.body.correo}, imagenes: ${req.body.imagenes}`);

  const { correo, ascii, imagenes, idioma = 'es', nombre, grupo } = req.body;

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

    // Get email template based on language
    const template = emailTemplates[idioma] || emailTemplates['es'];
    const emailText = template.text.replace('{link}', link);

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'pinakothek60aniv@gmail.com',
      to: correo,
      subject: template.subject,
      text: emailText
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
