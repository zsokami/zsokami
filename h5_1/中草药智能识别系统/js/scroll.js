function bindScroll(element) {
	element.addEventListener('mousewheel', function(e) {
		scroll(this, e.deltaX, e.deltaY);
	});
}

function scroll(ele, dx, dy) {
	const startTime = new Date();
	const [sx, sy] = [dx, dy].map(x => x / 177);
	let [lx, ly] = [0, 0];
	(function() {
		const dt = new Date() - startTime;
		if (dt >= 177) {
			ele.scrollBy(dx - lx, dy - ly);
		} else {
			const [ox, oy] = [sx, sy].map(x => Math.round(x * dt));
			ele.scrollBy(ox - lx, oy - ly);
			[lx, ly] = [ox, oy];
			requestAnimationFrame(arguments.callee);
		}
	})();
}