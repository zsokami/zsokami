var c = canvas.getContext('2d');
var w = canvas.width = innerWidth
var h = canvas.height = innerHeight;
var cx = w / 2, cy = h / 2;

var r = 300;
var d = 0;
var color = '#000';

var 

var timeout;

function draw() {
  clear();
  drawCenter();
  
}

function clear() {
  c.clearRect(0, 0, w, h);
}

function drawCenter() {
  c.beginPath();
  var a = p(d, r);
  c.moveTo(a.x, a.y);
  a = p(d + 120, r);
  c.lineTo(a.x, a.y);
  a = p(d + 240, r);
  c.lineTo(a.x, a.y);
  c.closePath();
  c.fillStyle = color;
  c.fill();
}

//画粒子
var partData = [[-1, 1, 1, -1, -1], [0, 1, 0, -1, 0]];

function drawParticle(x, y, size) {
  var a = size / 4;
  c.beginPath();
  c.moveTo(x, y - size);
  for(var i = 1; i < 5; i++) {
    c.lineTo(x + a * partData[0][i], y + a * partData[0][i - 1]);
    c.lineTo(x + size * partData[1][i], y + size * partData[1][i - 1]);
  }
  c.closePath();
  c.fill();
}

function p(d, r) { //d角度 r半径
  return {
    x: cx + Math.sin(d * Math.PI / 180) * r,
    y: cy - Math.cos(d * Math.PI / 180) * r
  }
}

function randColor() {
  var s = Math.floor(Math.random() * 4096).toString(16);
  return '#000'.slice(0, -s.length) + s;
}

document.ontouchstart = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e = e.targetTouches[0];
  if(c.isPointInPath(e.clientX, e.clientY)) {
    color = randColor();
    d++;
  }
}

draw();