# WebPage – Envío de fotos
Este proyecto permite a los usuarios seleccionar fotos desde una galería web y, al hacer clic en un botón, genera automáticamente una carpeta con las fotos seleccionadas, para enviárselas por correo al usuario. 
---
Cómo clonar y arrancar el proyecto (Primera vez)
  1. Clonar el repositorio
```bash
git clone https://github.com/cgzdev/WebPage.git
cd WebPage
```
  2. Instalar las dependencias
```bash
npm install
```
*Esto instalará express, cors y fs-extra.*

Antes de trabajar (Si ya lo haz clonado anteriormente)
Siempre actualiza tu proyecto con los últimos cambios:
```bash
git pull
```
  3. Correr el servidor (local, y por mientras)
```bash
node server.js
```
El servidor se ejecuta por defecto en http://localhost:3000 o 3001, dependiendo de tu configuración.
En caso de no funcionar, instalar node.js desde un navegador web
---
Estructura del proyecto
```none
WebPage/
├── server.js
├── package.json
├── public/
│   ├── index.html
│   ├── style.css
│   ├── selector.html
│   ├── style_selection.css
│   └── main.js
└── Images/
    ├── carpetas/
    └── originales/
```

Archivos ignorados por Git (al hacer pull, push o commit)
El proyecto ignora automáticamente :
```none
node_modules/
.obsidian/

Carpetas/
.env
```
Esto está configurado en .gitignore.

Tecnologías:
```none
  Node.js
  Express
  fs-extra
  HTML + CSS 
```
Autor:
Hecho por cgzdev

