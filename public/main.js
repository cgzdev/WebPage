// cruces
const canvas = document.getElementById('swisscross');
const ctx = canvas.getContext('2d');

let crosses = [];
const total = 100;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 200;
}

function createCross() {
  const x = Math.random() * canvas.width;
  const y = canvas.height + Math.random() * 100;
  const size = 12 + Math.random() * 13;
  const speed = 0.3 + Math.random() * 0.7;
  return { x, y, size, speed };
}

function initCrosses() {
  resizeCanvas();
  crosses = [];
  for (let i = 0; i < total; i++) {
    crosses.push(createCross());
  }
}

function drawCross(cross) {
  const opacity = 1 - (canvas.height - cross.y) / canvas.height;

  ctx.save();
  ctx.translate(cross.x, cross.y);
  ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
  ctx.lineWidth = Math.max(6, cross.size / 6);
  const s = cross.size / 2;

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

  for (let i = 0; i < crosses.length; i++) {
    let c = crosses[i];
    c.y -= c.speed;

    if (c.y < -c.size) {
      crosses[i] = createCross();
    }

    drawCross(c);
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initCrosses();
});

initCrosses();
animate();
