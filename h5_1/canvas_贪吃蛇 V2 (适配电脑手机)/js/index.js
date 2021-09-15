/* note: canvas绘制跨域或本地图片后会被标记为tainted，无法使用getImageData、toDataURL等api。使用图片base64可解决此问题 */
const IMG_BASE64 = {
	snake: 'iVBORw0KGgoAAAANSUhEUgAAAUAAAABACAYAAABr564eAAAABHNCSVQICAgIfAhkiAAAA/BJREFUeJzt3WGS2yAMhmHo9Ax7qr1TxmdqLtVcwv3RMstSO8FBIAne53/rjGy+VQCTEAAAAAAAAAAAAAAA84jaH8CDfb/t7/7bGDdq3IDao6ef2h/AmqMB97hvov8fA/MYtcdoPAz/pMHSMuBqfXzeQggMxoTaQwsPQfg7AEcMvtLH5235gUjtocn9A9AyR5RoDMBk5YGoFX5J6gafmf3eSIwfSaPr7fLm5jdNcwBJ0QrBVEeta3u4d0chOVMo/v4VTAVgWe/etXZzI2cLvdLIualyzk3z2h6NHqQ9WQvAUu9n08WN89ItSJDuOK6srGpe2zPPCyvWAzDpVWPTN2yGbkFCzVzVmdbaaV7bm7xWXsLQSwAm0tNFZm/SSl0f5uOlK/QWgCHI1tbkzSH8MAvrQegxABOJbtDcTSH8MCOrQeg5AENoD8Efkh8GwLHHfQuP+2Zu3513rTU19deI7g8rsNQNeu8Ak3c7QTOHIRB+WEV6zvf9tlsIQS35qrnW2FcvPltdsDLtVyG1OsCj7VUSW7au1lI1AOn6AN2vxBoB+Gxv6egQVPkKTNcHfOErsZ7hq8Cp6yP8gO9YJW53tYbDAnDfbztfeYHnVgjBswzQyIYh7TbBB1wzanFEcxtMz1Xg2vp1nQNkrg94T+oEZ54TtJALXQKQ4AParRCC2sQCcPYDSwENhGBfIgHIHB8AS2r/cDSvAhN+QF8rrAxr4TQYwAFCsI/mAIxxiy3HpgOoQwjKE5kDjHGLLIIAsGL4PsD8YmyDAfpgVVhWl32A6eYQhIA8QlBO1zdB8iAkBAHkljoQlW4QkCXxvvBMB6Lm/3dtXYZtg4lxi6wYAzjLAI1sGL4PMIUgQQi0YVvM/652xSoboekGAVigvorE3CDQpmUucKY5wHfqoP4qHN0gsJ4y7DTCLwRDvwuc3iahEwTWYGGsq3eAOTpB4LrVF0NapgBMBSAAXNG6F9JcANIFAtet2AVKbAQ3MweYYz4QwJnUIEm8C20yAEP4fsSWdhC2dKTan907ao+c9M+Fmg3AEHQOUzgacC0FP/pawsA8Ru1xRrLry6lvhK7V+8DVXgU+YqWztYLay7naIWn+MHqN3s+G6Q4wd3TgaggyD7J0W/0Kx4R9ofbIld8Cej8bbjrAMxIrX5oHS648EEeHX6l8dma4D1dram3lePTz4D4AZ6AVgumvrda1rZ1oPMPv2lisq2VuvgLPbPSKdzmvonltS8ppFq8hiHrmHsLVSa9cXllZ1by2RV5DkC6wHkVyoGWepnUgaF7bAo8hSADWo0jAC95CkACsZ+5dYAAYhQAEsCwCEHiBE4rmRQACWBYBCGBZfwCS3cdnPYSWywAAAABJRU5ErkJggg==',
	food: 'iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTIzVDE0OjEzOjQwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0wNVQyMjoyODo0NCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0wNVQyMjoyODo0NCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiMzAzOWJjYi1lZWFm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',
	ground: 'iVBORw0KGgoAAAANSUhEUgAAAQAAAACACAIAAABr1yBdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTI1VDE4OjQ2OjA5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNy0wNVQyMjoxMDo0MSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNy0wNVQyMjoxMDo0MSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplNDhjYjFmNy05MmY2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'
}
const ctx = canvas.getContext('2d');
const
	// 单位块尺寸
	tw = 64,
	halfTw = tw / 2;
let
	col, row, area,
	// 地图宽高
	mw, mh;

// 加载材质
const T = loadTextures('snake', 5, 5, 'food', 4, 3);
const groundT = loadTextures('ground', 4, 8);

const ID = {
	SNAKE: {
		TAIL: 0,
		BODY_1: 1,
		BODY_2: 2,
		BODY_CURVE: 3,
		HEAD: 4
	},
	FOOD: {
		GREEN_APPLE: 5,
		RED_APPLE: 6,
		GOLD_APPLE: 7
	}
}
ID.SNAKE.BODY_XOR = ID.SNAKE.BODY_1 ^ ID.SNAKE.BODY_2;
const TYPE = [];
Object.values(ID).forEach(t => Object.values(t).forEach(i => TYPE[i] = t));

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

let mode = 1;
let cheat = false;

onload = () => {
	onresize();
	if (mode == 3) prepare(2, 2);
	else prepare(14, 14);
	start();
	draw();
};

/**************** 核心逻辑 ****************/

function prepare(_col, _row) {
	col = _col;
	row = _row;
	area = col * row,
		mw = tw * col,
		mh = tw * row;
	sx = cx - mw / 2;
	sy = cy - mh / 2;
	ground = genGround(groundT.slice(0, 4), groundT.slice(4));
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
	if (!isInside(x, y) || TYPE[id = map[y][x]] != ID.FOOD) return false;
	let i = foods.findIndex(f => f.x == x && f.y == y);
	if (i == -1) return false;
	foods.splice(i, 1);
	eat(id);
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
	drawText('The length: ' + len, 32, 32, 32, '#330');
	drawText('The speed: ' + speed, 32, 64, 32, '#330');
	drawMessages();
	if (isGameOver) {
		if (isCompleted) {
			drawBorder(tw, 'rgba(0, 255, 0, 0.6)');
			drawCenterText('COMPLETED');
		} else {
			drawBorder(tw, 'rgba(255, 0, 0, 0.6)');
			drawCenterText('GAME OVER');
		}
	} else if (isPaused) {
		drawCenterText('PAUSED');
	}

	requestAnimationFrame(draw);
}

function drawSnake() {
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
	ctx.font = size + 'px comic sans ms';
	ctx.textAlign = align;
	ctx.textBaseline = valign;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

function drawCenterText(text) {
	drawText(text, cx, cy, 150, '#000', 'center', 'middle');
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
	drawTile0(x, y, T[id], Math.PI / 2 * nHalfPI);
}

function drawTile0(x, y, t, angle) {
	if (!angle) {
		ctx.drawImage(t.img, t.x, t.y, tw, tw, sx + tw * x, sy + tw * y, tw, tw);
		return;
	}
	ctx.save();
	ctx.translate(sx + tw * x + halfTw, sy + tw * y + halfTw);
	ctx.rotate(angle);
	ctx.drawImage(t.img, t.x, t.y, tw, tw, -halfTw, -halfTw, tw, tw);
	ctx.restore();
}

function clear() {
	ctx.clearRect(0, 0, w, h);
	ctx.putImageData(ground, sx - tw, sy - tw);
}

function genGround(grass, brick) {
	const unfairRandomGet = a => {
		let r = Math.random() * a.length * 3 | 0;
		return a[r >= a.length ? 0 : r];
	};
	for (let y = 0; y < row; y++)
		for (let x = 0; x < col; x++)
			drawTile0(x, y, unfairRandomGet(grass));
	ctx.save();
	ctx.shadowColor = 'black';
	ctx.shadowBlur = tw / 2;
	drawBorder(tw, 'black');
	ctx.restore();
	for (let i = 0, x = col, y = row; i < 4; i++)
		for (let j = i & 1 ? row : col; j >= 0; j--, x += D[i + 1], y += D[i])
			drawTile0(x, y, unfairRandomGet(brick));
	return ctx.getImageData(sx - tw, sy - tw, mw + tw * 2, mh + tw * 2);
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

// textureInfo = [imageName, cols, count, ...]
function loadTextures(...textureInfo) {
	let textures = [];
	for (let j = 0; j < textureInfo.length;) {
		let img = new Image();
		img.src = 'data:image/png;base64,' + IMG_BASE64[textureInfo[j++]];
		let w = tw * textureInfo[j++];
		for (let i = tw * textureInfo[j++], y = 0; i > 0; y += tw, i -= w)
			for (let x = 0, end = Math.min(i, w); x < end; x += tw)
				textures.push({ img, x, y });
	}
	return textures;
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
	if (!isInside((x - sx) / tw, (y - sy) / tw)) return;
	if (isGameOver) {
		start();
		return;
	}
	inputDir(calcDir({ x, y }, { x: cx, y: cy }));
}
// 触摸事件
if ('ontouchstart' in canvas) canvas.ontouchmove = canvas.ontouchstart = e => pointListener(e.changedTouches[0]);
// 鼠标事件
else canvas.onmousemove = canvas.onmousedown = e => e.buttons && pointListener(e);

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
