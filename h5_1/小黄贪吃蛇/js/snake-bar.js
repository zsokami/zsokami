{
	if (Game.param['non-first']) {
		document.currentScript.remove();
	} else {
		const bar = document.createElement('canvas');
		bar.style =
			`position: fixed;
		z-index: -1;
		top: 50%;
		transform: translateY(-50%);
		width: 100vw;`;
		bar.width = 1080;
		bar.height = Game.tw;
		document.currentScript.replaceWith(bar);

		const ctx = bar.getContext('2d');
		const ID = Game.ID.SNAKE;
		const max = 1080 / Game.tw | 0;
		const ox = 1080 - Game.tw * max >> 1;

		let l = 2;
		let bodyID = ID.BODY_1;
		let period = 280;

		addEventListener('load', () => {
			Game.drawTile0(ctx, ox, 0, ID.TAIL);
			Game.drawTile0(ctx, ox + Game.tw, 0, ID.HEAD);
			setTimeout(draw, period);
		});

		function draw() {
			const cur = l;
			if (++l > max) {
				bar.style.opacity = 0;
				setTimeout(() => {
					bar.remove();
					show();
				}, 200);
				return;
			}
			bodyID ^= ID.BODY_XOR;
			Game.clear(ctx, ox + Game.tw, 0, cur - 1, 1);
			Game.fill(ctx, ox + Game.tw, 0, cur - 1, 1, bodyID);
			Game.drawTile(ctx, ox, 0, cur, 0, ID.HEAD);
			if (period > 40) period -= 40;
			setTimeout(draw, period);
		}

		function show() {
			document.querySelectorAll('.hide').forEach(ele => ele.classList.remove('hide'));
		}
	}
}
