const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const backupPattern = /_backup_\d{14,}/;

fs.readdirSync(imagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && backupPattern.test(dirent.name))
  .forEach(dirent => {
    const backupPath = path.join(imagesDir, dirent.name);
    fs.rmSync(backupPath, { recursive: true, force: true });
    console.log(`Deleted backup folder: ${backupPath}`);
  });
console.log('All backup folders deleted.'); 