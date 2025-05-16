const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});

const { exec } = require('child_process');
