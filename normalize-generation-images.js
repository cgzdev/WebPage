const fs = require('fs');
const path = require('path');

// Map all grade variants to normalized codes and their sort order
const gradeOrder = ['M', 'K', 'PP', 'P', 'S', 'C'];
const gradeMap = [
  { regex: /maternal|mat(ernal)?/i, code: 'M' },
  { regex: /k(í|i)?nder|k[1-3]?/i, code: 'K' },
  { regex: /prepri(maria)?|pp/i, code: 'PP' },
  { regex: /primaria|p(?!re)/i, code: 'P' },
  { regex: /secundaria|s/i, code: 'S' },
  { regex: /preparatoria|cch|c(?!h)/i, code: 'C' },
];

// Helper to remove accents
const removeAccents = s => s.normalize('NFD').replace(/\p{Diacritic}/gu, '');

const imagesDir = path.join(__dirname, 'images');
const yearFolderRegex = /^(19|20)\d{2}$/;
const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
const backupDir = path.join(__dirname, `images_backup_${timestamp}`);

// Create backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

fs.readdirSync(imagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && yearFolderRegex.test(dirent.name))
  .forEach(dirent => {
    const folder = dirent.name;
    const generation = folder;
    const folderPath = path.join(imagesDir, folder);
    const backupFolderPath = path.join(backupDir, folder);
    if (!fs.existsSync(backupFolderPath)) {
      fs.mkdirSync(backupFolderPath, { recursive: true });
    }
    const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    // Parse all files and extract info
    let fileInfos = files.map(file => {
      let original = file;
      let ext = path.extname(file);
      let name = path.basename(file, ext);
      name = removeAccents(name);
      // Extract year (4 digits, not after g/G), before any other cleanup
      let year = '';
      let yearMatch = name.match(/(?<![gG])((?:19|20)\d{2})/);
      if (yearMatch) {
        year = yearMatch[1];
        name = name.replace(yearMatch[1], '');
      }
      // Remove leading number and separators
      name = name.replace(/^\d{1,2}[_\-\s]?/, '');
      // Find grade
      let grade = '';
      let gradeFound = false;
      for (const g of gradeMap) {
        const m = name.match(g.regex);
        if (m) {
          grade = g.code;
          name = name.replace(g.regex, '');
          gradeFound = true;
          break;
        }
      }
      if (!gradeFound) {
        grade = 'M';
      }
      // Find full section/group (e.g., S3B, P2A, K1C, etc.), but never a lone 'G'
      let section = '';
      // Look for patterns like 1A, 2B, 3C, etc. (not a lone G)
      let sectionMatch = name.match(/([1-6][A-F]|[A-F][1-6]|[1-6]|[A-F])/i);
      if (sectionMatch) {
        // Exclude a lone 'G' as section
        if (sectionMatch[0].toUpperCase() !== 'G') {
          section = sectionMatch[0].toUpperCase();
          name = name.replace(sectionMatch[0], '');
        }
      }
      // If grade is M and section is a single digit, remove the section
      if (grade === 'M' && /^[0-9]$/.test(section)) {
        section = '';
      }
      // Clean up unwanted words/symbols
      name = name.replace(/[°\.\-\s_]+/g, '').replace(/editada|sentados|parados/gi, '');
      return { original, ext, grade, section, year, generation };
    });
    // Sort by grade order, then section, then year
    fileInfos.sort((a, b) => {
      const gradeA = gradeOrder.indexOf(a.grade);
      const gradeB = gradeOrder.indexOf(b.grade);
      if (gradeA !== gradeB) return gradeA - gradeB;
      if (a.section !== b.section) return (a.section || '').localeCompare(b.section || '');
      if (a.year !== b.year) return (a.year || '').localeCompare(b.year || '');
      return a.original.localeCompare(b.original);
    });
    // Rename in sorted order, continuous numbering
    let counter = 1;
    fileInfos.forEach(info => {
      const num = String(counter).padStart(2, '0');
      let newName = `${num}_${info.grade}${info.section}_${info.year}_G${info.generation}${info.ext.toLowerCase()}`;
      const oldPath = path.join(folderPath, info.original);
      const newPath = path.join(folderPath, newName);
      // Backup original file
      const backupPath = path.join(backupFolderPath, info.original);
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(oldPath, backupPath);
      }
      if (oldPath !== newPath) {
        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`Renamed: ${info.original} -> ${newName}`);
        } else {
          console.warn(`SKIPPED (target exists): ${info.original} -> ${newName}`);
        }
      }
      counter++;
    });
  });
console.log(`Backup created at: ${backupDir}`); 