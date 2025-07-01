const fs = require('fs');
const path = require('path');

// CONFIG
const imagesDir = path.join(__dirname, 'images');
const yearFolderRegex = /^(19|20)\d{2}$/;
const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
const gradeOrder = ['M', 'K', 'PP', 'P', 'S', 'C'];

// Procesar todas las carpetas de generaciones
fs.readdirSync(imagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && yearFolderRegex.test(dirent.name))
  .forEach(dirent => {
    const folder = dirent.name;
    const folderPath = path.join(imagesDir, folder);
    const backupFolder = path.join(imagesDir, `${folder}_backup_${timestamp}`);
    // 1. Backup
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }
    const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    files.forEach(file => {
      fs.copyFileSync(path.join(folderPath, file), path.join(backupFolder, file));
    });
    console.log(`Backup created at: ${backupFolder}`);
    // 2. Remove leading digits and underscore
    let fileInfos = files.map(file => {
      const ext = path.extname(file);
      let name = path.basename(file, ext);
      // Remove leading digits and underscore
      name = name.replace(/^\d{2}_/, '');
      // Extract grade (M, K, PP, P, S, C)
      const gradeMatch = name.match(/^(M|K|PP|P|S|C)/i);
      const grade = gradeMatch ? gradeMatch[1].toUpperCase() : '';
      return { original: file, name, ext, grade };
    });
    // 3. Order by grade, then by name
    fileInfos.sort((a, b) => {
      const gradeA = gradeOrder.indexOf(a.grade);
      const gradeB = gradeOrder.indexOf(b.grade);
      if (gradeA !== gradeB) return gradeA - gradeB;
      return a.name.localeCompare(b.name);
    });
    // 4. Rename with new sequence
    fileInfos.forEach((info, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const newName = `${num}_${info.name}${info.ext.toLowerCase()}`;
      const oldPath = path.join(folderPath, info.original);
      const newPath = path.join(folderPath, newName);
      if (oldPath !== newPath) {
        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`[${folder}] Renamed: ${info.original} -> ${newName}`);
        } else {
          console.warn(`[${folder}] SKIPPED (target exists): ${info.original} -> ${newName}`);
        }
      }
    });
  });
console.log('All generations processed.'); 