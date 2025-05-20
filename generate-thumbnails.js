const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const originalesDir = path.join(__dirname, 'images', 'originales');
const thumbnailsDir = path.join(__dirname, 'images', 'thumbnails');

async function generarMiniaturas() {
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  const files = fs.readdirSync(originalesDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

  for (const file of files) {
    const input = path.join(originalesDir, file);
    const output = path.join(thumbnailsDir, file);

    if (!fs.existsSync(output)) {
      console.log(`Generando miniatura para ${file}`);
      try {
        await sharp(input)
          .resize({ width: 300 })
          .toFile(output);
      } catch (err) {
        console.error(`Error procesando ${file}:`, err.message);
      }
    }
  }
}
