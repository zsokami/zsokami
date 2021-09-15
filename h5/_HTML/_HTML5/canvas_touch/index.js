const c = canvas.getContext('2d');
const w = canvas.width = innerWidth;
const h = canvas.height = innerHeight;
const center = {x: w / 2, y: h / 2};

let col = 10, row = 10;
let tw = 30;
let sx, sy, mw, mh;

mw = tw * col;
mh = tw * row;
sx = (w - mw) / 2;
sy = (h - mh) / 2;

let x = 0;
let y = 0;

let color = '#0f0';
let first = true;

let lineColor = '#f0f';
let r = 10;
let lx, ly;


init();
drawBorder();

function start() {
  run();
}

function run() {
  drawTile(x, y, color);
  if(++x >= col) {
    x = 0;
    if(++y >= row) {
      return;
    }
  }
  setTimeout(run, 50);
}


function drawBorder() {
  c.strokeStyle = '#666';
  c.lineWidth = 1;
  c.strokeRect(sx - 0.5, sy - 0.5, mw + 1, mh + 1);
}

function drawTile(x, y, color) {
  c.fillStyle = color;
  c.fillRect(sx + tw * x, sy + tw * y, tw, tw);
}

/*
function drawCircle(x, y, r, color) {
  c.fillStyle = color;
  c.beginPath();
  c.arc(x, y, r, 0, 2 * Math.PI);
  c.fill();
}
*/

function drawLine(x1, y1, x2, y2, r, color) {
  c.strokeStyle = color;
  c.lineWidth = r * 2;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function init() {
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = '50px monospace';
}

function prevent(e) {
  e.preventDefault();
  e.stopPropagation();
}

canvas.ontouchstart = function(e) {
  prevent(e);
  e = e.targetTouches[0];
  if(first) {
    start();
    first = false;
  } else {
    color = HSV2Color(Math.random() * 360);
    drawLine(lx = e.clientX, ly = e.clientY, lx, ly, r, lineColor);
  }
}

canvas.ontouchmove = function(e) {
  prevent(e);
  e = e.targetTouches[0];
  drawLine(lx, ly, lx = e.clientX, ly = e.clientY, r, lineColor);
}