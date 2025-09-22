const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataDir = path.join(__dirname, '../data');
const userDataFile = path.join(dataDir, 'usuarios.md');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize markdown file with header if it doesn't exist
if (!fs.existsSync(userDataFile)) {
  const header = `# Usuarios Registrados\n\n| Nombre | Grupo | Email | Hora-Día-Mes-Año |\n|--------|-------|-------|------------------|\n`;
  fs.writeFileSync(userDataFile, header);
} else {
  // Migrate header to include Email column and new date label if missing
  try {
    const current = fs.readFileSync(userDataFile, 'utf8');
    let migrated = current;
    // Add Email column if absent (older format)
    if (!migrated.includes('| Email |') && migrated.includes('| Fecha de Registro |')) {
      migrated = migrated.replace(
        /\| Nombre \| Grupo \| Fecha de Registro \|\n\|[-|]+\|/,
        '| Nombre | Grupo | Email | Fecha de Registro |\n|--------|-------|-------|-------------------|'
      );
    }
    // Rename date header to Hora-Día-Mes-Año
    migrated = migrated.replace('Fecha de Registro', 'Hora-Día-Mes-Año')
                       .replace('|-------------------|', '|------------------|');
    if (migrated !== current) {
      fs.writeFileSync(userDataFile, migrated);
    }
  } catch (e) {
    console.warn('No se pudo migrar el encabezado de usuarios.md:', e);
  }
}

function formatTimestampLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const DD = pad(d.getDate());
  const MM = pad(d.getMonth() + 1);
  const YYYY = d.getFullYear();
  return `${hh}:${mm} - ${DD}-${MM}-${YYYY}`;
}

// Endpoint to get user data (markdown file)
router.get('/api/user-data', (req, res) => {
  try {
    if (fs.existsSync(userDataFile)) {
      const content = fs.readFileSync(userDataFile, 'utf8');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(content);
    } else {
      res.status(404).send('No user data found');
    }
  } catch (error) {
    console.error('Error reading user data:', error);
    res.status(500).send('Error reading user data');
  }
});

// Endpoint to save user data
router.post('/api/save-user-data', (req, res) => {
  try {
    const { nombre, grupo, correo } = req.body;
    
    if (!nombre || !grupo) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Create table row
    const safeEmail = (correo && typeof correo === 'string' && correo.trim()) ? correo.trim() : '-';
    const formatted = formatTimestampLocal();
    const tableRow = `| ${nombre} | ${grupo} | ${safeEmail} | ${formatted} |\n`;
    
    // Append to markdown file
    fs.appendFileSync(userDataFile, tableRow);
    
    console.log(`[USER DATA SAVED] ${nombre} - ${grupo} - ${safeEmail} - ${formatted}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Error al guardar los datos del usuario' });
  }
});

module.exports = router;
