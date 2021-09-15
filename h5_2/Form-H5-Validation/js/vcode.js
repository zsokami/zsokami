if (vcode && vimg) {
	let canvas = vimg;
	let c = canvas.getContext('2d');
	let w = canvas.width = 100;
	let h = canvas.height = 50;
	
	let word;
	let len = 4;
	
	let bc1, bc2;
	
	c.textAlign = 'center';
	c.textBaseline = 'middle';
	
	//生成验证码
	function gen() {
		let pn = '';
		word = randWord();
		drawBackground();
		for (let i = 0; i < len; i++) {
			pn += `[${word[i].toLowerCase()}${word[i].toUpperCase()}]`;
			drawChar(word[i], w / len * (i + 0.5), h / 2, w / len * (Math.random() + 0.6), Math.PI / 2 * (Math.random() - 0.5));
		}
		drawLines(10);
		vcode.pattern = pn;
	}
	
	function submit(text) {
		if (text.toLowerCase() == word.toLowerCase()) {
			alert('正确');
		} else {
			alert('错误');
		}
	}
	
	function drawBackground() {
		let p1 = randPoint();
		let p2 = randPoint();
		let g = c.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
		g.addColorStop(0, bc1 = randColor());
		g.addColorStop(1, bc2 = randColor());
		c.fillStyle = g;
		c.fillRect(0, 0, w, h);
	}
	
	function drawChar(char, x, y, size, angle) {
		c.font = 'bold ' + size + 'px monospace';
		let color;
		while (diff(bc1, color = randColor()) < 200 || diff(bc2, color) < 200);
		c.fillStyle = color;
		c.save();
		c.translate(x, y);
		c.rotate(angle);
		c.fillText(char, 0, 0);
		c.restore();
	}
	
	function drawLines(count) {
		c.globalAlpha = 0.4;
		for (let i = 0; i < count; i++) {
			let p1 = randPoint();
			let p2 = randPoint();
			c.strokeStyle = randColor();
			c.lineWidth = Math.random() * 4;
			c.beginPath();
			c.moveTo(p1.x, p1.y);
			c.lineTo(p2.x, p2.y);
			c.stroke();
		}
		c.globalAlpha = 1;
	}
	
	function drawCircles() {
	
	}
	
	function randColor() {
		return '#' + Math.random().toString(16).substr(2, 6);
	}
	
	function randPoint() {
		return {
			x: Math.random() * w,
			y: Math.random() * h
		}
	}
	
	function randWord() {
		let word = '';
		for (let i = 0; i < len; i++) {
			let code = parseInt(Math.random() * 62);
			code += code < 10 ? 48 : code < 36 ? 55 : 61;
			word += String.fromCharCode(code);
		}
		return word;
	}
	
	function diff(a, b) {
		if (!a || !b)
			return 765;
		return (
			Math.abs(red(a) - red(b)) +
			Math.abs(green(a) - green(b)) +
			Math.abs(blue(a) - blue(b))
		);
	}
	
	function red(a) {
		return $s(a, 1);
	}
	
	function green(a) {
		return $s(a, 3);
	}
	
	function blue(a) {
		return $s(a, 5);
	}
	
	function $s(a, p) {
		return parseInt(a.substr(p, 2), 16);
	}
	
	gen();
	canvas.onclick = gen;
}