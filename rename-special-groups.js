const fs = require('fs');
const path = require('path');

const specials = ['administracion', 'maestros', 'mantenimiento'];
const imagesDir = path.join(__dirname, 'images');

specials.forEach(group => {
  const folder = path.join(imagesDir, group);
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  let fileInfos = files.map(file => {
    const ext = path.extname(file);
    const yearMatch = file.match(/(19|20)\d{2}/);
    const year = yearMatch ? yearMatch[0] : '0000';
    return { original: file, ext, year };
  });
  // Order by year, then original name
  fileInfos.sort((a, b) => a.year.localeCompare(b.year) || a.original.localeCompare(b.original));
  fileInfos.forEach((info, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    let base = group;
    if (group === 'administracion') base = 'administracion';
    if (group === 'maestros') base = 'maestros';
    if (group === 'mantenimiento') base = 'mantenimiento';
    const newName = `${num}_${base}_${info.year}${info.ext.toLowerCase()}`;
    const oldPath = path.join(folder, info.original);
    const newPath = path.join(folder, newName);
    if (oldPath !== newPath) {
      if (!fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`[${group}] Renamed: ${info.original} -> ${newName}`);
      } else {
        console.warn(`[${group}] SKIPPED (target exists): ${info.original} -> ${newName}`);
      }
    }
  });
});
console.log('Special groups processed.'); 