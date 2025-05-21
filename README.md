# Documentation
---

### Inicialización del Proyecto 

---

## 1. Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/cgzdev/WebPage
cd proyecto-selector
```
---

## 2. Instalar dependencias

Asegúrate de tener Node.js instalado (si no, desde la web). Luego ejecuta:

```bash
npm install
```

Esto descargará todas las dependencias definidas en `package.json`, incluyendo:

- `express`: para el servidor.
- `sharp`: para procesar imágenes.

---

## 3. Iniciar el servidor

Una vez dentro de la carpeta del proyecto:

```bash
node server.js
```

El servidor se iniciará en:

```
http://localhost:3000
```

Abre esa URL en tu navegador para ver la página.

---

## 4. Acceso a las imágenes

Cuando un usuario ingresa su generación, la página hace una solicitud a:

```
/api/fotos?gen=202X
```

El servidor:

- Busca imágenes en `images/202X/`
- Genera miniaturas si no existen
- Devuelve rutas accesibles desde el frontend

---

## 5. Que no hacer

- No borres la carpeta `thumbnails/` si ya se generó.
- No subas `node_modules/`, `images/`, ni `.env` a Git.
- Si agregas nuevas generaciones, crea una carpeta `images/202X/` y coloca ahí las fotos originales.

---

No funciona

1. Verifica que las imágenes sean válidas y pesen más de 1KB.
2. Verifica que el parámetro `gen` coincida con el nombre de la carpeta.
3. Usa `npm install` si el proyecto no levanta por falta de dependencias.

## Organización del proyecto:
```bash
.
├── images/
│ ├── 2027/
│ └── thumbnails/
├── public/
│ ├── index.html
│ ├── main.js
│ ├── selector.html
│ ├── style.css
│ └── style_selection.css
├── routes/
│ └── dev-fotos.js
├── temp/
│ └── zips/
├── .gitignore
├── generate-thumbnails.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
```
Ahora si vamos a pasar con los códigos.

# index.html

---

**Resumen:**  
Este archivo HTML representa la página inicial del sistema. Su función es mostrar un formulario donde el usuario ingresa su correo electrónico y generación. Si los datos son válidos, se abre una nueva página para seleccionar fotos. También incorpora un botón de traducción automática y un canvas para animaciones visuales.

---

```html
<!DOCTYPE html>
<html lang="es">
<!-- Define que este es un documento HTML5 y que el idioma principal es el español -->

<head>
  <meta charset="UTF-8">
  <title>Formulario de Generación</title>
  <!-- Codificación de caracteres y título que aparece en la pestaña del navegador -->

  <link rel="stylesheet" href="style.css">
  <!-- Enlace a la hoja de estilos principal -->

  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;600;700&display=swap" rel="stylesheet">
  <!-- Fuente importada desde Google Fonts -->

  <script type="text/javascript">
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,fr,de,it',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }
  </script>
  <!-- Script que configura el botón de traducción automática a inglés, francés, alemán e italiano -->

  <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
  <!-- Carga el script de Google Translate con un callback a la función anterior -->
</head>

<body>
  <div class="contenedor">
    <!-- Contenedor principal para alinear el contenido con CSS -->

    <header class="header">
      <h1 class="header-title">Generaciones CSM</h1>
    </header>
    <!-- Encabezado visual con el nombre del sitio -->

    <div id="google_translate_element"></div>
    <!-- Aquí se insertará dinámicamente el botón de traducción -->

    <hr class="separador">
    <!-- Línea divisoria -->

    <h1>Registro y envío de fotos</h1>
    <!-- Título de la sección principal -->

    <form id="formulario">
      <!-- Formulario que recoge los datos del usuario -->

      <label for="email">Ingresa tu e-mail:</label>
      <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required>
      <!-- Campo de entrada para el correo electrónico -->

      <label for="generacion">Selecciona tu generación:</label>
      <input type="text" id="generacion" name="generacion" placeholder="Ej. 2020" required>
      <!-- Campo de entrada para la generación -->

      <button type="submit" id="verBtn">Ver</button>
      <!-- Botón que activa el envío del formulario -->

      <script>
        document.getElementById('formulario').addEventListener('submit', function(event) {
          event.preventDefault();
          <!-- Evita que el formulario recargue la página -->

          const generacion = document.getElementById('generacion').value;
          const email = document.getElementById('email').value;
          <!-- Se extraen los valores de los campos -->

          if (!generacion || !email) {
            alert('Por favor completa ambos campos.');
            return;
          }
          <!-- Validación básica: ambos campos deben estar llenos -->

          window.open(`selector.html?gen=${encodeURIComponent(generacion)}`, '_blank');
          <!-- Si los datos son válidos, se abre una nueva pestaña con la generación como parámetro -->
        });
      </script>
    </form>
  </div>

  <canvas id="swisscross"></canvas>
  <!-- Lienzo para animación decorativa -->

  <script src="main.js"></script>
  <!-- Script de animación (cruces suizas cayendo) -->
</body>

</html>

```
# style.css

---

**Resumen:**  
Esta hoja de estilos define la presentación visual de la página `index.html`. Incluye reglas para la tipografía, distribución del formulario, alineación de elementos y separación visual, basandonos en el estilo del csm. También se establecen propiedades para hacer que el diseño sea más legible y elegante.

---

```css
body {
  font-family: 'Montserrat', sans-serif;
  background-color: white;
  margin: 0;
  padding: 0;
}
<!-- 
Establece la fuente base como Montserrat.
El fondo es blanco.
Elimina márgenes y rellenos por defecto del navegador.
-->

.contenedor {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
}
<!-- 
Crea un contenedor centrado con ancho máximo de 600px.
Aplica un relleno interno de 40px para evitar que el contenido se vea pegado a los bordes.
-->

.header {
  text-align: center;
}
<!-- Centra horizontalmente todo el contenido dentro del encabezado. -->

.header-title {
  font-weight: 300;
  font-size: 36px;
  color: #e32236;
  margin-bottom: 10px;
}
<!-- 
El título principal (Generaciones CSM) se muestra en rojo suizo (#e32236),
con un peso de fuente ligero y tamaño grande.
-->

h1 {
  font-weight: 300;
  font-size: 24px;
  margin-top: 0;
}
<!-- 
Títulos secundarios (como "Registro y envío de fotos") con peso ligero.
Quita el margen superior para mejor alineación visual.
-->

label {
  display: block;
  margin-top: 20px;
  font-weight: 200;
}
<!-- 
Cada etiqueta del formulario aparece en su propia línea.
Se separan 20px del elemento anterior y tienen fuente muy ligera.
-->

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  font-weight: 100;
  font-family: 'Montserrat', sans-serif;
}
<!-- 
Los campos de entrada ocupan el 100% del contenedor.
Tienen un relleno interno de 10px y margen superior para no quedar pegados a la etiqueta.
Se usa fuente ultraligera y se asegura el uso de Montserrat.
-->

button {
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #e32236;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: 400;
  border-radius: 8px;
}
<!-- 
Botón de envío estilizado con fondo rojo, texto blanco, bordes redondeados,
tamaño de fuente adecuado y sin borde.
Incluye cursor tipo "mano" al pasar el mouse.
-->

.separador {
  margin: 30px 0;
  border: none;
  border-top: 2px solid #ccc;
}
<!-- 
Línea divisoria entre encabezado y contenido.
Tiene 2px de grosor, color gris claro y espacio vertical amplio.
-->

#google_translate_element {
  text-align: right;
  margin-top: -20px;
  margin-bottom: 10px;
}
<!-- 
Ubica el botón de traducción alineado a la derecha.
Se usa margen negativo para acercarlo al encabezado y dar separación inferior.
-->

canvas#swisscross {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: -1;
}
<!-- 
El canvas se posiciona fijo en el fondo de la pantalla.
No interfiere con clics (pointer-events: none) y se coloca detrás de todo con z-index negativo.
-->
```

# main.js

---

**Resumen:**  
Este archivo se encarga de animar cruces rojas descendiendo en un `canvas` que actúa como fondo decorativo para la página. Las cruces se generan con posiciones, tamaños y velocidades aleatorias, y se regeneran cuando salen de la vista. El efecto simula una "lluvia" de cruces suizas.

---

```js
const canvas = document.getElementById('swisscross');
const ctx = canvas.getContext('2d');
// Se obtiene el canvas y su contexto 2D para dibujar las cruces.

let crosses = [];
const total = 100;
// Arreglo que almacenará todas las cruces activas. Se inicializan 100 cruces.

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 200;
}
// Ajusta el tamaño del canvas al ancho de la ventana, pero con una altura fija de 200px.

function createCross() {
  const x = Math.random() * canvas.width;
  const y = canvas.height + Math.random() * 100;
  const size = 5 + Math.random() * 20;
  const speed = 0.3 + Math.random() * 0.7;
  return { x, y, size, speed };
}
// Crea una cruz con posición aleatoria en el eje X y por debajo del canvas (para que "suba").
// El tamaño varía entre 5 y 25px y la velocidad entre 0.3 y 1 px por frame.

function initCrosses() {
  resizeCanvas();
  crosses = [];
  for (let i = 0; i < total; i++) {
    crosses.push(createCross());
  }
}
// Inicializa el canvas y crea 100 cruces con valores aleatorios.

function drawCross(cross) {
  const opacity = 1 - (canvas.height - cross.y) / canvas.height;
  // La opacidad varía dependiendo de qué tan arriba esté la cruz.

  ctx.save();
  ctx.translate(cross.x, cross.y);
  ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
  ctx.lineWidth = Math.max(6, cross.size / 6);
  const s = cross.size / 2;

  // Dibuja una cruz: una línea horizontal y una vertical cruzadas en el centro
  ctx.beginPath();
  ctx.moveTo(-s, 0);
  ctx.lineTo(s, 0);
  ctx.moveTo(0, -s);
  ctx.lineTo(0, s);
  ctx.stroke();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Limpia todo el canvas en cada frame

  for (let i = 0; i < crosses.length; i++) {
    let c = crosses[i];
    c.y -= c.speed;
    // Mueve la cruz hacia arriba

    if (c.y < -c.size) {
      crosses[i] = createCross();
    }
    // Si la cruz sale del canvas por arriba, se reemplaza por una nueva que entra desde abajo

    drawCross(c);
  }

  requestAnimationFrame(animate);
  // Vuelve a llamar a animate() en el próximo frame para mantener la animación activa
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initCrosses();
});
// Cuando se redimensiona la ventana, el canvas se ajusta y se reinician las cruces

initCrosses();
animate();
// Se inicializa todo y se arranca la animación
```
Esos tres scripts nos ayudan a construir la página principal. Index.html, en la funcionalidad. Style.css en la estética y main.js en la generación procedural de las cruces.

Para la parte de la selección de imágenes tenemos tres scripts principales. selector.html, style_selection.css dev-fotos.js y generate-thumbnails.js. Aparte también hay un par de carpetas dedicadas.

Images, contiene dos carpetas, las de las fotos principales y las que se generan con el código (miniaturas), que tienen una resolución mas baja para mejor fluidez de la página

---

# selector.html

---

**Resumen:**  
Esta página muestra una galería de fotos correspondientes a la generación seleccionada por el usuario. Las imágenes se obtienen dinámicamente desde el servidor. El usuario puede seleccionar las fotos haciendo clic sobre ellas y tiene la opción de simular una descarga (aún no implementada).

---

```html
<!DOCTYPE html>
<html lang="es">
<!-- Documento HTML en español -->

<head>
  <meta charset="UTF-8">
  <title>Generación</title>
  <!-- Título que aparecerá en la pestaña del navegador -->

  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;600&display=swap" rel="stylesheet">
  <!-- Importa la fuente Montserrat en tres pesos distintos -->

  <link rel="stylesheet" href="style_selection.css">
  <!-- Estilo específico para esta página de selección -->
</head>

<body>

  <header>
    <h1 id="titulo-generacion">Generación 202X</h1>
    <!-- Título que será remplazado dinámicamente por el valor real -->

    <h2>Seleccione las fotos que desea</h2>
    <!-- Subtítulo explicativo -->

    <button onclick="enviarSeleccion()">Descargar selección</button>
    <!-- Botón que más adelante permitirá descargar las fotos seleccionadas -->
  </header>

  <section class="galeria" id="galeria">
    <!-- Las imágenes se insertarán aquí dinámicamente vía JavaScript -->
  </section>

<script>
  const params = new URLSearchParams(window.location.search);
  const generacion = params.get('gen');
  // Se obtiene el valor del parámetro 'gen' de la URL

  if (!generacion) {
    document.body.innerHTML = "<h1 style='color: red; font-family: Montserrat; margin-top: 100px;'>Error: No se especificó ninguna generación</h1>";
    throw new Error("No se proporcionó el parámetro 'gen'");
  }
  // Si no se proporciona una generación, se muestra un mensaje de error y se detiene el script

  document.getElementById('titulo-generacion').innerText = `Generación ${generacion}`;
  // Se actualiza dinámicamente el título con la generación recibida

  const galeria = document.getElementById('galeria');
  fetch(`/api/fotos?gen=${generacion}`)
  .then(res => res.json())
  .then(imagenes => {
    imagenes.forEach(({ thumb, full }, index) => {
      const label = document.createElement('div');
      label.className = 'foto-label';
      label.innerHTML = `
        <img src="${thumb}" alt="foto ${index + 1}" data-foto="${full}">
        <span>foto ${index + 1}</span>
      `;
      galeria.appendChild(label);
    });
    // Se cargan las imágenes miniatura y se insertan en la galería

    document.querySelectorAll('.galeria img').forEach(img => {
      img.addEventListener('click', () => {
        img.classList.toggle('seleccionada');
      });
    });
    // Al hacer clic en una imagen, se marca o desmarca como seleccionada visualmente
  })
  .catch(err => {
    galeria.innerHTML = '<p style="color:red">Error al cargar imágenes</p>';
    console.error(err);
  });
  // Si ocurre un error al obtener las imágenes, se muestra un mensaje de error

  function enviarSeleccion() {
    // Funcionalidad pendiente: podría usarse para descargar fotos seleccionadas o enviarlas al servidor
    alert('Funcionalidad de descarga aún no implementada.');
  }
</script>

</body>
</html>
```
# style_selection.css

---

**Resumen:**  
Este archivo define los estilos visuales de la página `selector.html`. Organiza la galería de fotos en un grid flexible y centrado, estiliza el encabezado con una caja fija y limpia, y proporciona retroalimentación visual al seleccionar imágenes. También incluye adaptaciones responsivas para pantallas pequeñas.

---

```css
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* 
Elimina los márgenes por defecto del navegador.
Aplica fuente Montserrat a todo el cuerpo.
Define un fondo gris claro.
Centrado vertical y horizontal con flexbox en columna.
*/

header {
  position: fixed;
  top: 20px;
  background-color: white;
  padding: 20px 40px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 100;
}
/*
Encabezado fijo en la parte superior con fondo blanco y bordes redondeados.
Aplica sombra para elevarlo visualmente.
Usa z-index alto para que esté por encima del contenido.
*/

header h1 {
  font-weight: 600;
  color: #b41a2c;
  margin: 0;
  font-size: 2rem;
}
/*
Título principal en rojo suizo (#b41a2c), sin márgenes,
peso fuerte y tamaño grande.
*/

header h2 {
  font-weight: 300;
  color: #333;
  margin: 5px 0 0 0;
  font-size: 1.2rem;
}
/*
Subtítulo con fuente más ligera, color gris oscuro y márgenes reducidos.
*/

.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
  margin-top: 30px;
  padding: 85px;
  width: 90%;
  max-width: 1000px;
}
/*
Define un grid fluido donde las columnas se ajustan automáticamente.
Cada imagen ocupa mínimo 200px, con un espacio de 25px entre ellas.
Se agrega margen superior y padding para no chocar con el header fijo.
*/

.foto-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
/*
Cada imagen y su texto se colocan en columna.
Se centran y se les permite interacción con el cursor.
*/

.foto-label img {
  width: 200px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
/*
Miniaturas: tamaño fijo, recortadas proporcionalmente (cover).
Con bordes redondeados y una leve sombra.
Incluyen animación de escala y sombra al interactuar.
*/

.foto-label img.seleccionada {
  transform: scale(0.95);
  box-shadow: 0 0 12px 5px #908b9f;
}
/*
Cuando el usuario selecciona una imagen, se encoge ligeramente
y se le aplica un resplandor morado/gris para marcarla.
*/

@media (max-width: 600px) {
  header h1 {
    font-size: 1.5rem;
  }
  header h2 {
    font-size: 1rem;
  }
}
/*
Responsividad: en pantallas pequeñas se reduce el tamaño
de fuente de los encabezados para mejor adaptación.
*/

```
# dev-fotos.js

---

**Resumen:**  
Este archivo define una ruta de API (`/api/fotos`) que sirve para obtener imágenes correspondientes a una generación dada. Si no existen miniaturas para esas imágenes, las genera automáticamente usando la librería `sharp`. El objetivo es optimizar la carga de imágenes en el frontend mediante versiones reducidas.

---

```js
process.on('uncaughtException', err => {
  console.error('Excepción no atrapada:', err);
});
process.on('unhandledRejection', reason => {
  console.error('Promesa no manejada:', reason);
});
// Captura errores no controlados del proceso para evitar que el servidor se caiga sin notificación.

const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
// Se importan los módulos necesarios: express para el servidor, fs y path para el manejo de archivos, y sharp para generar miniaturas.

const router = express.Router();
// Se crea un nuevo router de Express para definir rutas específicas.

router.get('/api/fotos', async (req, res) => {
  const gen = req.query.gen;
  if (!gen) {
    return res.status(400).json({ error: 'Falta el parámetro ?gen=' });
  }
  // Verifica que se haya proporcionado el parámetro 'gen' en la URL. Si no, responde con error 400.

  const originalDir = path.join(__dirname, '..', 'images', gen);
  const thumbDir = path.join(__dirname, '..', 'images', 'thumbnails', gen);
  // Define las rutas a las carpetas de imágenes originales y miniaturas, usando el nombre de la generación.

  try {
    const files = fs.readdirSync(originalDir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .filter(file => {
        try {
          const stats = fs.statSync(path.join(originalDir, file));
          return stats.size > 1000;
        } catch (err) {
          console.warn(`Archivo ilegible: ${file}`);
          return false;
        }
      });
    // Lee los archivos de la carpeta de imágenes originales.
    // Filtra por extensión válida (jpg, jpeg, png, webp).
    // También descarta archivos corruptos o demasiado pequeños.

    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }
    // Si la carpeta de miniaturas no existe, la crea.

    for (const file of files) {
      const input = path.join(originalDir, file);
      const output = path.join(thumbDir, file);

      if (fs.existsSync(output)) continue;
      // Si ya existe una miniatura para el archivo, la salta.

      try {
        console.log(`Intentando generar miniatura de ${file}`);
        await sharp(input)
         .resize({ width: 300 })
         .toFile(output);
        console.log(`Miniatura generada: ${file}`);
      } catch (err) {
        console.error(`Error con ${file}: ${err.message}`);
      }
      // Si no existe la miniatura, la genera con `sharp`, redimensionando a 300px de ancho.
    }

    const imagenes = files.map(file => ({
      thumb: `/images/thumbnails/${gen}/${encodeURIComponent(file)}`,
      full: `/images/${gen}/${encodeURIComponent(file)}`
    }));
    // Crea un arreglo de objetos con las rutas públicas de cada imagen:
    // `thumb` (miniatura) y `full` (tamaño original).

    res.json(imagenes);
    // Devuelve el arreglo como respuesta JSON.
  } catch (err) {
    console.error('Error general:', err.message);
    res.status(500).json({ error: 'Error interno al procesar imágenes' });
  }
  // Si ocurre un error en el proceso, se devuelve un error 500 al cliente.
});

module.exports = router;
// Exporta el router para que pueda ser usado desde `server.js`.
```

# generate-thumbnails.js

---

**Resumen:**  
Este script se usa para generar miniaturas de imágenes ubicadas en la carpeta `images/originales`. Las miniaturas se guardan en la carpeta `images/thumbnails` con un ancho fijo de 300 píxeles. Utiliza la librería `sharp` para la manipulación de imágenes.

---

```js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
// Se importan los módulos necesarios: 
// fs para sistema de archivos, path para rutas, y sharp para procesar imágenes.

const originalesDir = path.join(__dirname, 'images', 'originales');
const thumbnailsDir = path.join(__dirname, 'images', 'thumbnails');
// Define la ruta a la carpeta de imágenes originales y de miniaturas.

async function generarMiniaturas() {
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }
  // Si la carpeta de miniaturas no existe, se crea de forma recursiva.

  const files = fs.readdirSync(originalesDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  // Lee todos los archivos de la carpeta originales, 
  // y se queda solo con los que tengan una extensión de imagen válida.

  for (const file of files) {
    const input = path.join(originalesDir, file);
    const output = path.join(thumbnailsDir, file);
    // Define las rutas de entrada (original) y salida (miniatura).

    if (!fs.existsSync(output)) {
      console.log(`Generando miniatura para ${file}`);
      try {
        await sharp(input)
          .resize({ width: 300 })
          .toFile(output);
        // Genera una miniatura de 300 píxeles de ancho.
      } catch (err) {
        console.error(`Error procesando ${file}:`, err.message);
      }
    }
    // Solo genera miniaturas si no existen previamente.
  }
}

```
# Resumen del Funcionamiento del Backend

El backend sirve imágenes por generación escolar. Cuando un usuario selecciona una generación, el servidor:

1. Busca las imágenes originales en `images/[generación]`.
2. Genera miniaturas con `sharp` si no existen.
3. Responde con un JSON que contiene las rutas públicas de cada imagen (`thumb` y `full`).

## Archivos Clave

- **`server.js`**  
  Inicia el servidor y monta las rutas desde `dev-fotos.js`.

- **`routes/dev-fotos.js`**  
  Ruta `/api/fotos?gen=...`. Lee imágenes, genera miniaturas si faltan, y responde con sus rutas.

- **`generate-thumbnails.js`**  
  Script utilitario para pre-generar miniaturas de `images/originales` a `images/thumbnails`.

## Flujo

Frontend → `/api/fotos?gen=2024` → backend busca imágenes → genera miniaturas si faltan → responde con JSON → el frontend muestra la galería.

# Archivos de soporte del backend

---

## server.js

```js
// Archivo principal del servidor
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
// Sirve archivos estáticos como HTML, CSS y JS desde la carpeta /public

app.use(express.json());
// Permite recibir datos en formato JSON

app.use('/images', express.static(path.join(__dirname, 'images')));
// Permite que el navegador acceda directamente a las imágenes por URL

const fotosDev = require('./routes/dev-fotos');
app.use(fotosDev);
// Usa las rutas definidas en dev-fotos.js, especialmente /api/fotos

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
// Inicia el servidor en el puerto 3000
```
```bash
node_modules/   # Librerías externas, se reinstalan con npm install

.obsidian/      # Configuración local de Obsidian (no necesaria en el repo)

Carpetas/       # Carpeta generada por el servidor (temporal)

.env            # Variables de entorno (credenciales, configuraciones privadas)

images/         # Imágenes grandes que pueden evitarse en el repo
```

A su vez el package-lock.json tiene todas las dependencias necesarias para poder correr el servidor.


Autor: cgzdev
