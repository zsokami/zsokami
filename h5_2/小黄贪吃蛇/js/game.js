const ctx = canvas.getContext('2d');
let
	col, row, area,
	// 地图宽高
	mw, mh;

const [fontPrefix, fontSuffix] = getComputedStyle(canvas).font.split(/(?<=^| )\d+(?=px)/);
const ID = Game.ID;
const D = [0, -1, 0, 1, 0]; // 四方向向量 左上右下 [y,x|y,x|y, ..., x]
const MAX_MSGS = 3; // 消息数量最大限制
const GOAL = 56; // 一周目通关目标

const cheatCode = [1, 1, 0, 0, 1, 0, 1, 0]; // ***(手动狗头)

let
	w = canvas.width = 1080,
	h,
	cx = w / 2,
	cy,
	// 地图原点
	sx,
	sy;
// 高度自适应
onresize = () => {
	h = canvas.height = w * canvas.clientHeight / canvas.clientWidth;
	cy = Math.max(h / 2, cx + 224);
	sy = cy - mh / 2;
};

let
	head, // 蛇头坐标
	dir, // 方向: 0 左, 1 上, 2 右, 3 下
	len, // 蛇身长度
	speed, // 速度(格/秒)
	body; // 蛇身坐标数组(尾->头)

let bodyID = ID.SNAKE.BODY_1;

let map;
let foods;
let messages;

let runHandle;

let ground;

let enabled = true;
let isGameOver = true;
let isPaused = true;
let isCompleted = false;

let cheat = false;
let mode = Game.param['mode'];
if (!mode) mode = 1;

const modeName = ['生存', '生存二周目', '挑战', '双人对战'][mode - 1];
if (modeName) {
	document.title = modeName + '-' + document.title;
	onload = () => {
		onresize();
		if (mode == 4) {
			prepare(14, 14);
			start2();
			draw2();
		} else {
			if (mode == 3) prepare(2, 2);
			else prepare(14, 14);
			start();
			draw();
		}
	};
} else {
	document.title = '不支持该游戏模式-' + document.title;
}

/**************** 核心逻辑 ****************/

function prepare(_col, _row) {
	col = _col;
	row = _row;
	area = col * row,
		mw = Game.tw * col,
		mh = Game.tw * row;
	sx = cx - mw / 2;
	sy = cy - mh / 2;
	ground = genGround();
}

function start() {
	if (!enabled) return;
	if (mode == 3 && isCompleted) {
		if (col >= 14) prepare(2, 2);
		else prepare(col + 1, row + 1);
	}
	isPaused = isGameOver = isCompleted = false;
	head = { x: -1, y: 0 };
	dir = 2;
	len = 3;
	speed = mode == 3 ? 2 : 3;
	map = Array.from({ length: row }, () => []);
	body = [];
	foods = [];
	messages = [];
	addFood(ID.FOOD.GREEN_APPLE);
	showMsg('游戏开始', '#008');
	run();
}

function run() {
	bodyID ^= ID.SNAKE.BODY_XOR;
	let x = head.x + D[dir + 1];
	let y = head.y + D[dir];
	head = { x, y };
	body.push(head);
	if (!tryEat(x, y)) {
		if (body.length > len) {
			let p = body.shift();
			delete map[p.y][p.x];
		}
		if (!isInside(x, y) || map[y][x]) {
			gameOver();
			return;
		}
	}
	map[y][x] = 1;
	if (judgeClear()) {
		isCompleted = true;
		gameOver();
		return;
	}
	if (!cheat) runHandle = setTimeout(run, 1000 / speed);
}

function pause() {
	if (isPaused) return;
	showMsg('游戏暂停，按下操作键或点击草地继续', '#008');
	clearTimeout(runHandle);
	isPaused = true;
}

function gameOver() {
	if (isCompleted) {
		if (mode == 3 && col < 14) showMsg('闯关成功！按下操作键或点击草地进入下一关！', '#608');
		else showMsg('完美通关！可喜可贺！可喜可贺！', '#608');
	} else {
		showMsg('游戏结束，按下操作键或点击草地重新开始', '#008');
	}
	if (mode == 2) mode = 1;
	isGameOver = true;
	isPaused = true;
	enabled = false;
	setTimeout(() => enabled = true, 500);
}

function judgeClear() {
	switch (mode) {
		case 1:
			if (len >= GOAL) {
				mode = 2;
				showMsg('恭喜通关一周目！开始二周目，奖励一个金苹果！', '#608');
				addFood(ID.FOOD.GOLD_APPLE);
			}
			break;
		case 2:
		case 3:
			return body.length >= area;
	}
	return false;
}

function grow() {
	len++;
	showMsg('蛇身增长了');
}

function speedUp() {
	speed += 0.5;
	showMsg('速度提升了', '#b00');
}

function resetSpeed() {
	speed = 1;
	showMsg('速度变慢了', '#bb0');
}

function tryEat(x, y) {
	let id;
	if (!isInside(x, y) || Game.type(id = map[y][x]) != 'food') return false;
	if (!removeFood(x, y)) return false;
	eat(id);
	return true;
}

function removeFood(x, y) {
	let i = foods.findIndex(f => f.x == x && f.y == y);
	if (i == -1) return false;
	foods.splice(i, 1);
	return true;
}

function eat(id) {
	grow();
	switch (id) {
		case ID.FOOD.GREEN_APPLE:
			addFood(ID.FOOD.GREEN_APPLE);
			if (mode == 3) break;
			if (Math.random() < 0.3)
				addFood(ID.FOOD.RED_APPLE);
			else if (mode == 2 && Math.random() < 0.1)
				addFood(ID.FOOD.GOLD_APPLE);
			break;
		case ID.FOOD.RED_APPLE:
			speedUp();
			break;
		case ID.FOOD.GOLD_APPLE:
			resetSpeed();
	}
}

function showMsg(text, color = '#080') {
	messages.push({
		text: text,
		color: color,
		outTime: now() + 3000
	});
	if (messages.length > MAX_MSGS) messages.shift();
}

function addFood(id) {
	let i = area - body.length - foods.length;
	if (i == 0) return;
	i = Math.random() * i | 0;
	for (let y = 0, j = 0; y < row; y++)
		for (let x = 0; x < col; x++)
			if (!map[y][x]) {
				if (j == i) {
					foods.push({ x, y });
					map[y][x] = id;
					return;
				}
				j++;
			}
}

function isInside(x, y) {
	return x >= 0 && y >= 0 && x < col && y < row;
}

/**************** 绘图 ****************/

// 绘制帧
function draw() {
	clear();

	// 画食物
	foods.forEach(f => drawTile(f.x, f.y, map[f.y][f.x], 0));

	// 画蛇
	drawSnake();

	// 画进度条、文字等其他内容
	let lineLength = w - 32;
	if (mode == 2 || isCompleted) {
		drawLine(16, 16, 16 + lineLength, 16, 24, '#ff0');
	} else {
		lineLength *= Math.min(len / (mode == 1 ? GOAL : area), 1);
		drawLine(16 + lineLength, 16, w - 4, 16, 2, '#0f0');
		drawLine(16, 16, 16 + lineLength, 16, 24, '#0f0');
	}
	drawText('长度: ' + len, 32, 32, 32, '#330');
	drawText('速度: ' + speed, 32, 64, 32, '#330');
	drawMessages();
	if (isGameOver) {
		if (isCompleted) {
			drawBorder(Game.tw, 'rgba(0, 255, 0, 0.6)');
			drawCenterText(mode == 3 ? '闯关成功' : '完美通关');
		} else {
			drawBorder(Game.tw, 'rgba(255, 0, 0, 0.6)');
			drawCenterText('游戏结束');
		}
	} else if (isPaused) {
		drawCenterText('暂停');
	}

	requestAnimationFrame(draw);
}

function drawSnake() {
	drawSnake0(head, body, bodyID, dir);
}

function drawSnake0(head, body, bodyID, dir) {
	for (let i = body.length - 2; i > 0; i--) {
		let d1 = calcDir(body[i], body[i + 1]);
		let d2 = calcDir(body[i], body[i - 1]);
		if (d1 - d2 & 1)
			drawTile(body[i].x, body[i].y, ID.SNAKE.BODY_CURVE, d1 + 2 + ((d2 + 1 & 3) != d1));
		else drawTile(body[i].x, body[i].y, bodyID, d1);
	}
	if (body.length > 1)
		drawTile(body[0].x, body[0].y, ID.SNAKE.TAIL, calcDir(body[0], body[1]));
	if (isInside(head.x, head.y))
		drawTile(head.x, head.y, ID.SNAKE.HEAD, dir + 2);
}

function drawBorder(width, color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.strokeRect(sx - width / 2, sy - width / 2, mw + width, mh + width);
}

function drawText(text, x, y, size, color, align = 'left', valign = 'top') {
	ctx.font = fontPrefix + size + fontSuffix;
	ctx.textAlign = align;
	ctx.textBaseline = valign;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

function drawCenterText(text, color = '#000') {
	drawText(text, cx, cy, 150, color, 'center', 'middle');
}

function strokeText(text, x, y, size, color, align = 'left', valign = 'top') {
	ctx.font = fontPrefix + size + fontSuffix;
	ctx.textAlign = align;
	ctx.textBaseline = valign;
	ctx.strokeStyle = color;
	ctx.strokeText(text, x, y);
}

function strokeCenterText(text, color = '#000') {
	strokeText(text, cx, cy, 150, color, 'center', 'middle');
}

let curTime;

function drawMessages() {
	if (!messages.length) return;
	if (!isPaused) {
		curTime = now();
		while (messages[0].outTime - curTime <= 0) {
			messages.shift();
			if (!messages.length) return;
		}
	}
	let duration = 1000;
	messages.forEach((m, i) => {
		let diff = m.outTime - curTime;
		ctx.globalAlpha = diff < duration ? diff / duration : 1;
		drawText(m.text, 32, 128 + 32 * i, 32, m.color);
	});
	ctx.globalAlpha = 1;
}

function drawLine(x1, y1, x2, y2, width, color, cap = 'round', join = 'miter') {
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.lineCap = cap;
	ctx.lineJoin = join;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawTile(x, y, id, nHalfPI) {
	Game.drawTile(ctx, sx, sy, x, y, id, nHalfPI);
}

function clear() {
	ctx.clearRect(0, 0, w, h);
	ctx.putImageData(ground, sx - tw, sy - tw);
}

function genGround() {
	Game.fill(ctx, sx, sy, col, row, ID.Ground.GRASS);
	ctx.save();
	ctx.shadowColor = 'black';
	ctx.shadowBlur = Game.tw / 2;
	drawBorder(Game.tw, 'black');
	ctx.restore();
	Game.stroke(ctx, sx, sy, col, row, ID.Ground.BRICK);
	return ctx.getImageData(sx - Game.tw, sy - Game.tw, mw + Game.tw * 2, mh + Game.tw * 2);
}

/**************** 双人对战模式 ****************/

let
	head2,
	dir2,
	speed2,
	body2;

let bodyID2 = ID.SNAKE.BODY_1;
let runHandle2;
let win;

function start2() {
	if (!enabled) return;
	isGameOver= false;
	head = { x: -1, y: 0 };
	head2 = { x: col, y: row - 1 };
	dir = 2;
	dir2 = 0;
	speed = speed2 = 3;
	map = Array.from({ length: row }, () => []);
	body = [];
	body2 = [];
	foods = [];
	initFoods();
	run1();
	run2();
}

function initFoods() {
	for (let y = 0; y < row; y++)
		for (let x = 0; x < col; x++) {
			foods.push({ x, y });
			map[y][x] = y > 0 && y < row - 1 && Math.random() < 0.2 ? ID.FOOD.RED_APPLE : ID.FOOD.GREEN_APPLE;
		}
}

function run1() {
	bodyID ^= ID.SNAKE.BODY_XOR;
	let x = head.x + D[dir + 1];
	let y = head.y + D[dir];
	head = { x, y };
	body.push(head);
	if (!isInside(x, y) || map[y][x] == 1) {
		gameOver2(2);
		return;
	}
	if (map[y][x] == ID.FOOD.RED_APPLE) {
		speed += 0.5;
	}
	map[y][x] = 1;
	removeFood(x, y);
	runHandle = setTimeout(run1, 1000 / speed);
}

function run2() {
	bodyID2 ^= ID.SNAKE.BODY_XOR;
	let x = head2.x + D[dir2 + 1];
	let y = head2.y + D[dir2];
	head2 = { x, y };
	body2.push(head2);
	if (!isInside(x, y) || map[y][x] == 1) {
		gameOver2(1);
		return;
	}
	if (map[y][x] == ID.FOOD.RED_APPLE) {
		speed2 += 0.5;
	}
	map[y][x] = 1;
	removeFood(x, y);
	runHandle2 = setTimeout(run2, 1000 / speed2);
}

function gameOver2(_win) {
	win = _win;
	isGameOver = true;
	enabled = false;
	clearTimeout(runHandle);
	clearTimeout(runHandle2);
	setTimeout(() => enabled = true, 500);
}

function draw2() {
	clear();
	foods.forEach(f => drawTile(f.x, f.y, map[f.y][f.x], 0));
	drawSnake();
	ctx.filter = 'hue-rotate(40deg)';
	drawSnake0(head2, body2, bodyID2, dir2);
	ctx.filter = 'none';
	if (isGameOver) {
		ctx.save();
		ctx.shadowColor = 'white';
		ctx.shadowBlur = 60;
		ctx.lineWidth = 10;
		strokeCenterText(win == 1 ? '小黄赢了' : '小绿赢了', 'white');
		drawCenterText(win == 1 ? '小黄赢了' : '小绿赢了', win == 1 ? '#E9B300' : '#6AD806');
		ctx.restore();
	}
	requestAnimationFrame(draw2);
}

/**************** 辅助 ****************/

function now() {
	return new Date().getTime();
}

// 计算p1相对于p2的方向: 0 左, 1 上, 2 右, 3 下
function calcDir(p1, p2) {
	let
		x = p1.x - p2.x,
		y = p1.y - p2.y,
		a = x > y,
		b = x > -y;
	return a ^ b | b << 1;
}

/**************** 控制 ****************/

let cheatCode_i = 0;

function turn(newDir) {
	let ok = dir - newDir & 1;
	if (ok) {
		dir = newDir;
		cheatCode_i = 0;
	} else if (dir == newDir == cheatCode[cheatCode_i]) {
		if (++cheatCode_i >= cheatCode.length) {
			cheatCode_i = 0;
			showMsg('作弊模式已' + ((cheat = !cheat) ? '开启' : '关闭'), '#ddd');
			if (!cheat && !isPaused) run();
		}
	} else {
		cheatCode_i = 0;
	}
	return ok;
}

function inputDir(newDir) {
	if (isPaused) {
		isPaused = false;
		showMsg('游戏继续', '#008');
		turn(newDir);
		run();
	} else if (turn(newDir)) {
		clearTimeout(runHandle);
		run();
	} else if (cheat && dir == newDir) {
		run();
	}
}

function pointListener(p) {
	let
		b = canvas.getBoundingClientRect(),
		x = (p.clientX - b.x) * canvas.width / b.width,
		y = (p.clientY - b.y) * canvas.height / b.height;
	if (x < sx || y < sy || x >= sx + mw || y >= sy + mh) return;
	if (isGameOver) {
		start();
		return;
	}
	inputDir(calcDir({ x, y }, { x: cx, y: cy }));
}

if (mode != 4) {
	let down;
	
	// 触摸事件
	if ('ontouchstart' in canvas) {
		canvas.ontouchmove = canvas.ontouchstart = e => pointListener(e.changedTouches[0]);
	}
	// 鼠标事件
	else {
		canvas.onmousedown = e => {
			down = true;
			pointListener(e);
		};
		onmouseup = () => {
			down = false;
		};
		canvas.onmousemove = e => down && e.buttons && pointListener(e);
	}

	const KEYCODE_DIR_MAP = { 65: 0, 37: 0, 87: 1, 38: 1, 68: 2, 39: 2, 83: 3, 40: 3 };
	// 键盘按下事件
	onkeydown = function(e) {
		let newDir = KEYCODE_DIR_MAP[e.keyCode];
		if (newDir != null) {
			e.preventDefault();
			if (isGameOver) {
				start();
				return;
			}
			inputDir(newDir);
		}
	}
	
	// 失去焦点事件
	onblur = function(e) {
		pause();
	}
} else {
	const KEYCODE_DIR_MAP = { 65: 0, 37: 4, 87: 1, 38: 5, 68: 2, 39: 6, 83: 3, 40: 7 };
	// 键盘按下事件
	onkeydown = function(e) {
		let newDir = KEYCODE_DIR_MAP[e.keyCode];
		if (newDir != null) {
			e.preventDefault();
			if (isGameOver) {
				start2();
				return;
			}
			if (newDir < 4) {
				if (dir - newDir & 1) {
					dir = newDir;
					clearTimeout(runHandle);
					run1();
				}
			} else {
				newDir -= 4;
				if (dir2 - newDir & 1) {
					 dir2 = newDir;
					 clearTimeout(runHandle2);
					 run2();
				}
			}
		}
	}
}
