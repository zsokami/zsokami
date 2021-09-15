const c = canvas.getContext('2d');
const w = canvas.width = innerWidth;
const h = canvas.height = innerHeight;
const cx = w / 2, cy = h / 2;
const d = [0, -1, 0, 1, 0];
const col = 10, row = 10;
const tw = 90;
const mw = tw * col, mh = tw * row;
const sx = cx - mw / 2, sy = cy - mh / 2;
const snake_color = '#0a3';
const food_color = '#fd0';

let head, food, dir, len, body, timeout;
let touchable = true, over = false;

init();

function run() {
  head.x += d[dir + 1];
  head.y += d[dir];
  if(!isInsize(head.x, head.y)) {
    gameOver();
    return;
  }
  let tail;
  if(body.length >= len) tail = body.shift();
  for(let p in body) {
    if(head.x == body[p].x && head.y == body[p].y) {
      gameOver();
      return;
    }
  }
  if(tail) clearTile(tail.x, tail.y);
  for(let p in body) {
    drawTile(body[p].x, body[p].y, 'rgba(255, 255, 255, 0.05)');
  }
  body.push({x: head.x, y: head.y});
  drawTile(head.x, head.y, snake_color);
  if(head.x == food.x && head.y == food.y) {
    setFood();
    len++;
  }
  c.clearRect(0, 0, w, 180);
  drawText('The length: ' + len, 30, 90, 90, '#330', 'left');
  timeout = setTimeout(run, 300);
}

function gameOver() {
  drawBorder(30, '#f00');
  drawText('game over', cx, cy, 150, '#000', 'center');
  touchable = false;
  over = true;
  setTimeout(function() {
    touchable = true;
  }, 500);
}

function drawBorder(width, color) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.strokeRect(sx - width / 2, sy - width / 2, mw + width, mh + width);
}

function drawText(text, x, y, size, color, align) {
  c.font = size + 'px monospace';
  c.textAlign = align;
  c.textBaseline = 'middle';
  c.fillStyle = color;
  c.fillText(text, x, y);
}

function drawTile(x, y, color) {
  c.fillStyle = color;
  c.fillRect(sx + tw * x, sy + tw * y, tw, tw);
}

function clearTile(x, y) {
  c.clearRect(sx + tw * x, sy + tw * y, tw, tw);
}

function clear() {
  c.clearRect(0, 0, w, h);
}

function setFood() {
  let ps = [];
  for(let p in body)
    ps.push(body[p].x + body[p].y * col);
  ps.sort(function(a, b) {
    return a - b;
  });
  let n = parseInt(Math.random() * (col * row - ps.length));
  for(let p in ps) if(n >= ps[p]) n++;
  food.x = n % col;
  food.y = (n - food.x) / col;
  drawTile(food.x, food.y, food_color);
}

function isInsize(x, y) {
  return x >= 0 & y >= 0 & x < col & y < row;
}

function init() {
  head = {x: -1, y: 0}
  food = {x: 0, y: 0}
  dir = 2;
  len = 3;
  body = [];
  clear();
  drawBorder(30, '#600');
  setFood();
  run();
}

function prevent(e) {
  e.preventDefault();
  e.stopPropagation();
}

canvas.ontouchstart = function(e) {
  prevent(e);
  if(!touchable) return;
  if(over) {
    over = false;
    init();
    return;
  }
  e = e.targetTouches[0];
  let x = e.clientX - cx;
  let y = e.clientY - cy;
  let a = x < y, b = x < -y;
  let tmp = a? b? 0: 3: b? 1: 2;
  if(dir - tmp & 1) {
    dir = tmp;
    clearTimeout(timeout);
    run();
  }
}

canvas.ontouchmove = canvas.ontouchstart;