(() => {
	//背景渐变动画
	const INTERVAL = 16; //帧间隔时间
	const DURATION = 1000; //一次动画的持续时间
	let navStyle = document.getElementsByClassName('nav')[0].style;

	frame();
	setInterval(frame, INTERVAL);

	function frame() {
		let d = now() % DURATION / DURATION * 200;
		navStyle.background = 'repeating-linear-gradient(160deg,hsl(30,100%,65%)' + d + '%,hsl(30,100%,50%)' + (d + 100) + '%,hsl(30,100%,65%)' + (d + 200) + '%)';
	}

	function now() {
		return new Date().getTime();
	}
})();