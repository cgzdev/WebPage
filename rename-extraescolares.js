const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'images', 'extraescolares');
if (!fs.existsSync(folder)) {
  console.error('No existe la carpeta extraescolares');
  process.exit(1);
}

const files = fs.readdirSync(folder).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
const usedNames = {};

files.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  let name = path.basename(file, ext);
  // Quitar sufijo gGRUPOS_EXTRAESCOLARES y guiones bajos finales
  name = name.replace(/_?gGRUPOS_EXTRAESCOLARES$/i, '');
  // Buscar año
  const yearMatch = name.match(/(19|20)\d{2}/);
  const year = yearMatch ? yearMatch[0] : '0000';
  // Buscar actividad (lo que queda antes del año)
  let actividad = name.replace(/^(\d{2}_)?/, '').replace(/(19|20)\d{2}.*/, '').replace(/_/g, ' ').trim();
  // Normalizar nombres
  actividad = actividad
    .replace(/horario extendido|he/gi, 'horario_extendido')
    .replace(/orquesta[\s_]*t[ií]pica/gi, 'orquesta_tipica')
    .replace(/f[uú]tbol/gi, 'futbol')
    .replace(/basketball/gi, 'basketball')
    .replace(/handball/gi, 'handball')
    .replace(/orquesta/gi, 'orquesta')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
  let newName = `${actividad}_${year}${ext}`;
  // Si ya existe, agregar _2, _3, etc.
  let count = 2;
  while (usedNames[newName] || fs.existsSync(path.join(folder, newName))) {
    newName = `${actividad}_${year}_${count}${ext}`;
    count++;
  }
  usedNames[newName] = true;
  const oldPath = path.join(folder, file);
  const newPath = path.join(folder, newName);
  if (oldPath !== newPath) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${file} -> ${newName}`);
  }
});
console.log('Extraescolares renombrados.'); 