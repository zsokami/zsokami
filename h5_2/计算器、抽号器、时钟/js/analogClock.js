(() => {
	var canvas = analogClock;
	var c = canvas.getContext('2d');
	var w = canvas.width = canvas.clientWidth;
	var h = canvas.height = canvas.clientHeight;
	var cx = w / 2;
	var cy = h / 2;

	var r = Math.min(w, h) / 2 - 10;
	var rate = r / 500;
	var long = r - 60 * rate;
	var short = r - 30 * rate;
	var tR = 380 * rate;
	var lC = '#000';
	var lW = 2;
	var lP = c.lineCap;

	var hHand = {
		length: 200 * rate,
		width: 40 * rate,
		cap: 'round',
		color: '#000'
	}
	var iHand = {
		length: 280 * rate,
		width: 20 * rate,
		cap: 'round',
		color: '#000'
	}
	var sHand = {
		length: 380 * rate,
		width: 10 * rate,
		cap: 'round',
		color: '#f00'
	}

	var lastTime;

	init();
	run();

	function run() {
		var d = new Date();
		d = Math.floor(d.getTime() / 1000) - d.getTimezoneOffset() * 60;
		if (d != lastTime) {
			lastTime = d;
			draw(d);
		}
		requestAnimationFrame(run);
	}

	// 绘制
	function draw(time) {
		c.clearRect(0, 0, w, h);

		c.lineWidth = lW;
		c.lineCap = lP;
		drawCircle(r + 10 * rate, lC);

		for (var i = 5; i < 65; i++) {
			var ang = rad(i, 60);
			drawLine(ang, long, r, lC);
			c.fillText(i / 5 | 0, cx + Math.sin(ang) * tR, cy - Math.cos(ang) * tR);
			for (var j = i + 4; i < j; drawLine(rad(++i, 60), short, r, lC));
		}

		drawHand(rad(time, 43200), hHand);
		drawHand(rad(time, 3600), iHand);
		drawHand(rad(time, 60), sHand);
	}

	// 画针
	function drawHand(ang, hand) {
		c.lineWidth = hand.width;
		c.lineCap = hand.cap;
		drawLine(ang, 0, hand.length, hand.color);
	}

	// 画线
	function drawLine(ang, r, R, color) {
		var sin = Math.sin(ang);
		c.beginPath();
		var cos = Math.cos(ang);
		c.moveTo(cx + sin * r, cy - cos * r);
		c.lineTo(cx + sin * R, cy - cos * R);
		c.strokeStyle = color;
		c.stroke();
	}

	// 画圆
	function drawCircle(r, color) {
		c.beginPath();
		c.arc(cx, cy, r, 0, Math.PI * 2);
		c.strokeStyle = color;
		c.stroke();
	}

	// 弧度
	function rad(a, b) {
		return Math.PI * 2 * a / b;
	}

	function init() {
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.font = 'bold ' + (100 * rate + 1 | 0) + 'px monospace';
	}
})();
