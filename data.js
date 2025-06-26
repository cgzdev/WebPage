// data.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'selecciones.json');

let selecciones = {};
if (fs.existsSync(dbPath)) {
  selecciones = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function guardarSelecciones() {
  fs.writeFileSync(dbPath, JSON.stringify(selecciones, null, 2));
}

module.exports = { selecciones, guardarSelecciones };
