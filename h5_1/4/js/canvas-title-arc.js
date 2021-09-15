/**
 * 绘制弧形渐变色文本
 */
{
	const canvas = document.getElementById('canvas-title');
	const c = canvas.getContext('2d');

	const TEXT = canvas.innerHTML;
	const SIZE = 80; // 字体大小
	const FONT = `bold ${SIZE}px sans-serif`;
	const PADDING = 10; // 画布边距
	const STROKE_WIDTH = 5; // 文本描边宽度
	const SHADOW_BLUR = 10; // 阴影大小
	const ANGLE = -Math.PI / 2; // 文本中心点对应的弧度
	const R = 600; // 文本所在圆的半径，越大越平

	initFont(c);

	// 测量文本以重置画布宽高
	const { // 解构赋值，冒号后是变量名
		ascent: ascent,
		width: width,
		height: height
	} = measureArcText(c, TEXT, ANGLE, R);

	const left = PADDING;
	const right = left + width;
	const top = PADDING;
	const bottom = top + height;

	canvas.width = right + PADDING;
	canvas.height = bottom + PADDING;

	// 文本中心点
	const x = canvas.width / 2;
	const y = top + ascent;

	// 重置宽高会初始化画布上下文，需重新设置字体
	initFont(c);

	// 描边渐变
	const sLG = genHLG(c, left, right, width, ['blue', 'red']);

	// 填充渐变
	const fLG = genHLG(c, left, right, 20, [
		'crimson', 'purple',
		'red', 'crimson',
		'orangered', 'red',
		'orange', 'orangered',
		'gold', 'orange',
		'yellowgreen', 'gold',
		'green', 'yellowgreen',
		'steelblue', 'skyblue',
		'mediumpurple', 'steelblue',
		'purple', 'mediumpurple',
	]);
	/*
	全色调均匀分布，已废弃
	for(let i = 0; i < 360; i += 30) {
		fLG.addColorStop(i / 360, `hsl(${i+30},100%,50%)`);
		fLG.addColorStop((i + 30) / 360, `hsl(${i},100%,50%)`);
	}
	*/

	// 创建临时画布辅助绘制
	const canvas_temp = document.createElement('canvas');
	const c_temp = canvas_temp.getContext('2d');
	canvas_temp.width = canvas.width;
	canvas_temp.height = canvas.width;
	initFont(c_temp);
	c_temp.lineWidth = STROKE_WIDTH;

	// 阴影
	c_temp.save();
	c_temp.strokeStyle = c_temp.shadowColor = 'grey';
	c_temp.shadowBlur = SHADOW_BLUR;
	drawArcText(c_temp, TEXT, ANGLE, R, x, y, 'strokeText');
	c_temp.restore();
	c.drawImage(canvas_temp, 0, 0);

	// 描边
	drawArcTextWithLG(c_temp, 'strokeText', sLG);
	c.drawImage(canvas_temp, 0, 0);

	// 填充
	drawArcTextWithLG(c_temp, 'fillText', fLG);
	c.drawImage(canvas_temp, 0, 0);

	/**
	 * 绘制渐变色弧形文本
	 * @param {CanvasRenderingContext2D} c
	 * @param {String} f 'strokeText' or 'fillText'
	 * @param {CanvasGradient} lg
	 */
	function drawArcTextWithLG(c, f, lg) {
		c.clearRect(0, 0, canvas.width, canvas.height);
		drawArcText(c, TEXT, ANGLE, R, x, y, f);
		c.save();
		c.globalCompositeOperation = 'source-in';
		c.fillStyle = lg;
		c.fillRect(0, 0, canvas.width, canvas.height);
		c.restore();
	}

	/**
	 * 初始化字体
	 * @param {CanvasRenderingContext2D} c
	 */
	function initFont(c) {
		c.font = FONT;
		c.textAlign = 'center';
		c.textBaseline = 'bottom';
	}

	/**
	 * 按颜色对数组生成水平渐变
	 * @param {CanvasRenderingContext2D} c
	 * @param {Float} left
	 * @param {Float} right
	 * @param {Float} singleWidth
	 * @param {Array} colorPairs
	 * @return {CanvasGradient}
	 */
	function genHLG(c, left, right, singleWidth, colorPairs) {
		const
			fullWidth = Math.ceil((right - left) / singleWidth) * singleWidth, // 实际渐变总宽度
			lg = c.createLinearGradient(left, 0, left + fullWidth, 0);
		for (let i = 0, j = 0; i < fullWidth; j = j == colorPairs.length ? 0 : j) {
			lg.addColorStop(i / fullWidth, colorPairs[j++]);
			lg.addColorStop((i += singleWidth) / fullWidth, colorPairs[j++]);
		}
		return lg;
	}

	/**
	 * 测量弧形文本所占方框宽高
	 * @param {CanvasRenderingContext2D} c
	 * @param {String} text
	 * @param {Float} centerAngle
	 * @param {Float} r
	 * @return {Metrics}
	 */
	function measureArcText(c, text, centerAngle, r) {
		const
			tm = c.measureText(text),
			tw = tm.width,
			th = tm.actualBoundingBoxAscent || 87,
			R = th + r,
			halfAngle = tw / 2 / r,
			startAngle = centerAngle - halfAngle,
			endAngle = centerAngle + halfAngle,
			startPoint = Math.ceil(startAngle * 2 / Math.PI),
			endPoint = Math.floor(endAngle * 2 / Math.PI),

			b = [R, R, R, R], // 右、下、左、上各边缘与圆心的垂直距离

			dist = (a1, a2) => { // 用于计算两个弧度的弧距离
				const d = Math.abs(a1 - a2) % (Math.PI * 2);
				return d > Math.PI ? Math.PI * 2 - d : d;
			};

		for (let i = endPoint - 3; i < startPoint; i++) {
			const
				p = i & 3,
				targetAngle = p * Math.PI / 2,
				minDist = Math.min(dist(startAngle, targetAngle), dist(endAngle, targetAngle));
			b[p] = Math.cos(minDist) * (minDist < Math.PI / 2 ? R : r);
		}

		return {
			ascent: th,
			width: b[0] + b[2],
			height: b[1] + b[3]
		};
	}

	/**
	 * 绘制弧形文本
	 * @param {CanvasRenderingContext2D} c
	 * @param {String} text
	 * @param {Float} centerAngle
	 * @param {Float} r
	 * @param {Float} x
	 * @param {Float} y
	 * @param {String} f 'strokeText' or 'fillText'
	 */
	function drawArcText(c, text, centerAngle, r, x, y, f) {
		// 计算总弧度的一半和每个字符弧度的一半
		let halfTextAngle = 0;
		let halfAngles = new Array(text.length);
		for (let i = 0; i < text.length; i++) {
			halfTextAngle += halfAngles[i] = c.measureText(text[i]).width / 2 / r;
		}

		// 计算圆心位置
		const antiAngle = centerAngle + Math.PI;
		x += Math.cos(antiAngle) * r;
		y += Math.sin(antiAngle) * r;

		// 移动和旋转画布至开始状态
		c.save();
		c.translate(x, y);
		c.rotate(centerAngle - halfTextAngle + halfAngles[0] + Math.PI / 2);

		// 开始逐个字符绘制文本
		r = -r;
		const end = text.length - 1;
		for (let i = 0;;) {
			c[f](text[i], 0, r);
			if (i == end) { // 循环条件放到这里以防止下面 halfAngles[++i] 出现越界情况
				break;
			}
			c.rotate(halfAngles[i] + halfAngles[++i]);
		}

		c.restore();
	}
}