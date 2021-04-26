{
	const bg = document.createElement('canvas');
	const a = 2368;
	const n = a / Game.tw;
	bg.style =
		`position: fixed;
		z-index: -1;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 100vmax;
		height: 100vmax;
		min-width: ${a}px;
		min-height: ${a}px;
		opacity: 0.2;`;
	bg.width = bg.height = a;
	document.currentScript.replaceWith(bg);
	addEventListener('load', () => {
		Game.fill(bg.getContext('2d'), 0, 0, n, n, Game.ID.Ground.GRASS);
	});
}
