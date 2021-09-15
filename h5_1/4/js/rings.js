/**
 * 全屏圆环动画
 */
{
	const DURATION = 2500; // 一个圆环的存在时长
	const FADE_DURATION = 300; // 淡入淡出时长
	const DELAY = 100; // 下一个圆环出现的延迟时长
	const MIN_R = 50; // 最小半径
	const MAX_R = 100; // 最大半径
	const MIN_V = 10 / 1000; // 最小速度/毫秒
	const MAX_V = 50 / 1000; // 最大速度/毫秒
	const THICKNESS = 0.5; // 圆环的粗度
	const ALPHA = 0.1; // 圆环的不透明度
	const CIRCLE = Math.PI * 2; // 一圈弧度

	const canvas = createCanvas();
	const c = canvas.getContext('2d');

	const rings = []; // 存储圆环
	
	let w, h; // 记录画布宽高

	// 实时更新画布宽高
	(onresize = () => {
		w = canvas.width = innerWidth;
		h = canvas.height = innerHeight;
	})();

	draw();

	function draw() { // 绘制帧
		const time = now();

		// 圆环生成逻辑
		if(rings.length == 0) // 没有就直接生成
			rings.push(genRing(time));
		else {
			if(time - rings[rings.length - 1].time >= DELAY) // 距离上次生成达到 DELAY 毫秒就生成
				rings.push(genRing(time));
			if(time - rings[0].time >= DURATION) // 持续时间达到 DURATION 毫秒就移除
				rings.shift();
		}

		c.clearRect(0, 0, w, h); // 清空画布

		// 绘制圆环
		for(let i in rings) {
			i = rings[i];
			const diff = time - i.time;
			// 调节不透明度实现淡入淡出效果
			c.globalAlpha = diff < FADE_DURATION ? diff / FADE_DURATION :
				DURATION - diff < FADE_DURATION ? (DURATION - diff) / FADE_DURATION : 1;
			c.strokeStyle = i.color;
			c.lineWidth = i.r * THICKNESS;
			c.beginPath();
			// 画圆
			c.arc(i.x + i.xv * diff, i.y + i.yv * diff, i.r, 0, CIRCLE);
			// 填充描边
			c.stroke();
		}
		// 请求绘制帧
		requestAnimationFrame(draw);
	}

	function genRing(time) { // 生成圆环
		const v = rnd(MIN_V, MAX_V); // 速度
		const rad = rnd(0, CIRCLE); // 角度
		return {
			time: time,
			color: `hsla(${rnd(0,360)},100%,50%,${ALPHA})`, // 随机色调
			r: rnd(MIN_R, MAX_R), // 半径
			x: rnd(0, w), // x坐标
			y: rnd(0, h), // y坐标
			xv: Math.cos(rad) * v, // x速度
			yv: Math.sin(rad) * v // y速度
		};
	}

	function rnd(n, m) {
		return Math.random() * (m - n) + n;
	}

	function now() {
		return new Date().getTime();
	}
	
	function createCanvas() { //创建画布
		const canvas = document.createElement('canvas');
		// 布满页面
		canvas.style = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:-1';
		document.body.appendChild(canvas);
		return canvas;
	}
}