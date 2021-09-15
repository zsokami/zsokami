const c = canvas.getContext('2d');
const w = canvas.width = innerWidth, h = canvas.height = innerHeight;
const cx = w / 2, cy = h / 2;
const col = 16, row = 16;
const tw = 64;
const mw = tw * col, mh = tw * row;
//四方向偏移量
const d = [0, -1, 0, 1, 0];
//材质图片
const img_snake = new Image();
img_snake.src = 'img/snake.png';
const img_food = new Image();
img_food.src = 'img/food.png';
const imgData = [
  //0 尾部
  {img: img_snake, x: 0, y: 0},
  //1 身体_1
  {img: img_snake, x: 64, y: 0},
  //2 身体_2
  {img: img_snake, x: 128, y: 0},
  //3 弯曲
  {img: img_snake, x: 192, y: 0},
  //4 头部
  {img: img_snake, x: 256, y: 0},
  //5 食物_青苹果
  {img: img_food, x: 0, y: 0},
  //6 食物_红苹果
  {img: img_food, x: 64, y: 0}
];

//地图原点
let sx = cx - mw / 2, sy = cy - mh / 2;
//蛇的参数
let head, dir, len, speed;
//蛇身组
let body;
//食物组
let foods;
//信息组
let messages;
let msgsMax = 3;
//身体材质id
let body_TID;

let timeout;
let touchable, over;

init();

function run() {
  head.x += d[dir + 1];
  head.y += d[dir];
  body.push({x: head.x, y: head.y});
  if(body.length > len) body.shift();
  for(let i = 0; i < foods.length; i++) {
    if(head.x == foods[i].x && head.y == foods[i].y) {
      eat(foods[i].id);
      foods.splice(i, 1);
      break;
    }
  }
  draw();
  if(!isInsize(head.x, head.y)) {
    gameOver();
    return;
  }
  for(let i = body.length - 2; i >= 0; i--) {
    if(head.x == body[i].x && head.y == body[i].y) {
      gameOver();
      return;
    }
  }
  body_TID = body_TID == 1? 2: 1;
  timeout = setTimeout(run, 1000 / speed);
}

function gameOver() {
  clearAllTimeout();
  drawBorder(24, '#f00');
  drawText('GAME OVER', cx, cy, 150, '#000', 'center', 'middle');
  touchable = false;
  over = true;
  setTimeout(function() {
    touchable = true;
  }, 500);
}

//绘制帧
function draw() {
  clear();
  
  //画食物
  for(let i in foods) {
    let f = foods[i];
    drawTile(f.x, f.y, f.tid, 0);
  }
  
  //画蛇
  for(let i = body.length - 2; i > 0; i--) {
    let d1 = getDir(body[i], body[i + 1]);
    let d2 = getDir(body[i], body[i - 1]);
    if(d1 - d2 & 1)
      drawTile(body[i].x, body[i].y, 3, d1 + 2 + ((d2 + 1 & 3) != d1));
    else drawTile(body[i].x, body[i].y, body_TID, d1);
  }
  if(body.length > 1)
    drawTile(body[0].x, body[0].y, 0, getDir(body[0], body[1]));
  if(isInsize(head.x, head.y))
    drawTile(head.x, head.y, 4, dir + 2);

  //画边框、文字等其他内容
  drawBorder(24, '#600');
  drawLine(16, 16, 16 + (w - 32) * len / 100, 16, 32, '#0f0');
  drawText('The length: ' + len, 32, 32, 32, '#330', 'left', 'top');
  drawText('The speed: ' + speed, 32, 64, 32, '#330', 'left', 'top');
  for(let i in messages) {
    let m = messages[i];
    c.globalAlpha = m.alpha;
    drawText(m.text, 32, 128 + 32 * i, 32, m.color, 'left', 'top');
  }
  c.globalAlpha = 1;
}

function drawBorder(width, color) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.strokeRect(sx - width / 2, sy - width / 2, mw + width, mh + width);
}

function drawText(text, x, y, size, color, align, valign) {
  c.font = size + 'px monospace';
  c.textAlign = align;
  c.textBaseline = valign;
  c.fillStyle = color;
  c.fillText(text, x, y);
}

function drawLine(x1, y1, x2, y2, width, color) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function drawTile(x, y, id, dir) {
  let dat = imgData[id];
  c.save();
  c.translate(sx + tw * (x + 0.5), sy + tw * (y + 0.5));
  c.rotate(Math.PI / 2 * dir);
  c.drawImage(dat.img, dat.x, dat.y, tw, tw, -tw / 2, -tw / 2, tw, tw);
  c.restore();
}

function clear() {
  c.clearRect(0, 0, w, h);
}

function msg(s, c) {
  messages.push(new Message(s, c));
  if(messages.length > msgsMax) deleteMsg();
}

function deleteMsg() {
  clearTimeout(messages.shift().timeout);
  draw();
}

function clearAllTimeout() {
  for(let i in messages)
    clearTimeout(messages[i].timeout);
}

//信息对象构造函数
function Message(text, color) {
  this.text = text;
  this.color = color || '#080';
  this.alpha = 1;
  this.timeout = setTimeout(deleteMsg, 3000);
}

function addFood(id) {
  let ps = [];
  for(let p in body)
    ps.push(body[p].x + body[p].y * col);
  for(let p in foods)
    ps.push(foods[p].x + foods[p].y * col);
  ps.sort(function(a, b) {
    return a - b;
  });
  let n = parseInt(Math.random() * (col * row - ps.length));
  for(let p in ps) if(n >= ps[p]) n++;
  foods.push({
    id: id,
    tid: id + 5,
    x: n % col,
    y: parseInt(n / col)
  });
}

function eat(id) {
  switch(id) {
  case 0:
    addFood(0);
    len++;
    msg('蛇身增长了');
    if(Math.random() < 0.3)
      addFood(1);
    break;
  case 1:
    len++;
    speed++;
    msg('蛇身增长了');
    msg('速度提升了', '#0b0');
  }
}

function isInsize(x, y) {
  return x >= 0 & y >= 0 & x < col & y < row;
}

function getDir(p1, p2) {
  let x = p1.x - p2.x, y = p1.y - p2.y;
  let a = x < y, b = x < -y;
  return a? b? 0: 3: b? 1: 2;
}

function init() {
  head = {x: -1, y: 0}
  dir = 2;
  len = 3;
  speed = 3;
  body_TID = 1;
  body = [];
  foods = [];
  messages = [];
  touchable = true;
  over = false;
  addFood(0);
  run();
}

function prevent(e) {
  e.preventDefault();
  e.stopPropagation();
}

canvas.ontouchmove = canvas.ontouchstart = function(e) {
  prevent(e);
  if(!touchable) return;
  if(over) {
    init();
    return;
  }
  e = e.targetTouches[0];
  let tmp = getDir({x: e.clientX, y: e.clientY}, {x: cx, y: cy});
  if(dir - tmp & 1) {
    dir = tmp;
    clearTimeout(timeout);
    run();
  }
}
