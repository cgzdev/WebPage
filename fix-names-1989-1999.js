const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const startGen = 1989;
const endGen = 1999;
const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
const backupDir = path.join(__dirname, `images_backup_${timestamp}`);

// Create backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

for (let gen = startGen; gen <= endGen; gen++) {
  const folder = gen.toString();
  const folderPath = path.join(imagesDir, folder);
  if (!fs.existsSync(folderPath)) continue;
  const backupFolderPath = path.join(backupDir, folder);
  if (!fs.existsSync(backupFolderPath)) {
    fs.mkdirSync(backupFolderPath, { recursive: true });
  }
  const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  // Backup all files
  files.forEach(file => {
    const src = path.join(folderPath, file);
    const dest = path.join(backupFolderPath, file);
    fs.copyFileSync(src, dest);
  });
  // Parse all files
  let fileInfos = files.map(file => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    // Format: <num>_<group>_<year>_G<gen>
    const match = name.match(/^(\d{2})_([A-Z]+\d*)(?:_([0-9]{4}|__))?_G(\d{4})$/i);
    return match ? {
      original: file,
      num: match[1],
      group: match[2],
      year: match[3],
      gen: match[4],
      ext
    } : null;
  }).filter(Boolean);
  // Sort by num
  fileInfos.sort((a, b) => parseInt(a.num) - parseInt(b.num));
  // Fix missing years
  for (let i = 0; i < fileInfos.length; i++) {
    if (fileInfos[i].year === '__') {
      // Try previous
      if (i > 0 && fileInfos[i-1].year && fileInfos[i-1].year !== '__') {
        fileInfos[i].year = (parseInt(fileInfos[i-1].year) + 1).toString();
      } else if (i < fileInfos.length - 1 && fileInfos[i+1].year && fileInfos[i+1].year !== '__') {
        fileInfos[i].year = (parseInt(fileInfos[i+1].year) - 1).toString();
      } else {
        fileInfos[i].year = '0000'; // fallback
      }
    }
  }
  // Renumber repeated P1, S1, C1
  const groupCounts = {};
  fileInfos.forEach(info => {
    // Remove the 1 after PP
    if (/^PP1/i.test(info.group)) {
      info.group = 'PP';
    }
    // Renumber repeated P1, S1, C1
    const base = info.group.replace(/^(P|S|C)\d+$/i, (m, p) => p);
    if (/^(P|S|C)1$/i.test(info.group)) {
      groupCounts[base] = (groupCounts[base] || 0) + 1;
      info.group = base + groupCounts[base];
    }
  });
  // Actually rename files
  fileInfos.forEach(info => {
    const newName = `${info.num}_${info.group}_${info.year}_G${info.gen}${info.ext.toLowerCase()}`;
    const oldPath = path.join(folderPath, info.original);
    const newPath = path.join(folderPath, newName);
    if (oldPath !== newPath) {
      if (!fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${info.original} -> ${newName}`);
      } else {
        console.warn(`SKIPPED (target exists): ${info.original} -> ${newName}`);
      }
    }
  });
}
console.log(`Backup created at: ${backupDir}`); 