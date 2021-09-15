{
	const canvas = document.getElementById('canvas-title');
	const c = canvas.getContext('2d');
	const font = 'bold 5em sans-serif';
	c.font = font;
	const {
		actualBoundingBoxLeft: left,
		actualBoundingBoxRight: right,
		actualBoundingBoxAscent: ascent,
		actualBoundingBoxDescent: descent
	} = c.measureText(canvas.innerHTML);
	const padding = 5;
	canvas.width = left + right + padding * 2;
	canvas.height = ascent + descent + padding * 2;
	c.font = font;

	c.save();

	c.shadowColor = 'grey';
	c.shadowBlur = 3;

	const sLG = c.createLinearGradient(padding, 0, canvas.width - padding, 0);
	sLG.addColorStop(0, 'black');
	sLG.addColorStop(1, 'white');
	c.strokeStyle = sLG;
	c.lineWidth = 5;
	c.strokeText(canvas.innerHTML, left + padding, ascent + padding);

	c.restore();

	const sw = 20; // 单个渐变宽度
	const aw = Math.ceil((canvas.width - padding * 2) / sw) * sw; // 实际渐变总宽度
	const colorLine = [
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
	];
	const fLG = c.createLinearGradient(padding, 0, padding + aw, 0);
	for (let i = 0, j = 0; i < aw; j = j == colorLine.length ? 0 : j) {
		fLG.addColorStop(i / aw, colorLine[j++]);
		fLG.addColorStop((i += sw) / aw, colorLine[j++]);
	}
	/*
	for(let i = 0; i < 360; i += 30) {
		fLG.addColorStop(i / 360, `hsl(${i+30},100%,50%)`);
		fLG.addColorStop((i + 30) / 360, `hsl(${i},100%,50%)`);
	}
	*/
	c.fillStyle = fLG;
	c.fillText(canvas.innerHTML, left + padding, ascent + padding);
}