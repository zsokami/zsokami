//全屏圆环动画

const INTERVAL = 16; //帧间隔时间
const DURATION = 2500; //一个圆环的存在时长
const FADE_DURATION = 300; //淡入淡出时长
const DELAY = 100; //下一个圆环出现的延迟时长
const MIN_R = 50; //最小半径
const MAX_R = 100; //最大半径
const MIN_V = 10 / 1000; //最小速度/毫秒
const MAX_V = 50 / 1000; //最大速度/毫秒
const THICKNESS = 0.5; //圆环的粗度
const ALPHA = 0.1; //圆环的不透明度
const CIRCLE = Math.PI * 2; //一圈

const canvas = createCanvas();
const c = canvas.getContext('2d');

let w, h;
let rings = [];

(onresize = () => {
	w = canvas.width = innerWidth;
	h = canvas.height = innerHeight;
	draw();
})();

setInterval(draw, INTERVAL);

function draw() {
	let time = now();
	if(rings.length == 0)
		rings.push(genRing(time));
	else {
		if(time - rings[rings.length - 1].time >= DELAY)
			rings.push(genRing(time));
		if(time - rings[0].time >= DURATION)
			rings.shift();
	}
	c.clearRect(0, 0, w, h);
	for(let i in rings) {
		i = rings[i];
		let diff = time - i.time;
		//调节不透明度实现淡入淡出效果
		c.globalAlpha = diff < FADE_DURATION ? diff / FADE_DURATION :
			DURATION - diff < FADE_DURATION ? (DURATION - diff) / FADE_DURATION : 1;
		c.strokeStyle = i.color;
		c.lineWidth = i.r * THICKNESS;
		c.beginPath();
		c.arc(i.x + i.xv * diff, i.y + i.yv * diff, i.r, 0, CIRCLE);
		c.stroke();
	}
}

function genRing(time) { //生成圆环
	let v = rnd(MIN_V, MAX_V); //速度
	let rad = rnd(0, CIRCLE); //角度
	return {
		time: time,
		color: 'hsla(' + rnd(0, 360) + ',100%,50%,' + ALPHA + ')', //随机色调
		r: rnd(MIN_R, MAX_R),
		x: rnd(0, w),
		y: rnd(0, h),
		xv: Math.cos(rad) * v,
		yv: Math.sin(rad) * v
	};
}

function rnd(n, m) {
	return Math.random() * (m - n) + n;
}

function now() {
	return new Date().getTime();
}

function createCanvas() {
	let canvas = document.createElement('canvas');
	canvas.style = 'width: 100%; height: 100%; position: fixed; top: 0; z-index: -1';
	document.body.appendChild(canvas);
	return canvas;
}