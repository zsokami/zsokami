const btns = document.querySelectorAll('#out~*');
const btnMap = {
	'Escape': btns[0],
	'Enter': btns[btns.length - 1]
};
btns.forEach(btn => btnMap[btn.innerText] = btn);

// 同时绑定点击按钮和按下键盘事件
function click(e) {
	const input = e.key || e.target.innerText;
	switch (input) {
		case 'AC':
		case 'Escape':
			out.innerText = '';
			break;
		case '=':
		case 'Enter':
			out.innerText += '=' + eval(out.innerText);
			break;
		case 'Backspace':
			out.innerText = out.innerText.slice(0, -1);
			break;
		default:
			if (input.match(/^[-+*/%.\d()]$/))
				out.innerText += input;
			else
				return;
	}
	out.scrollTo(out.scrollWidth, 0);
}

onclick = click;
onkeydown = e => {
	click(e);
	btnMap[e.key] && btnMap[e.key].classList.add('active');
};
onkeyup = e => {
	btnMap[e.key] && btnMap[e.key].classList.remove('active');
};

// 让显示框可横向滚动

let down = false;
let vx;
let af;

out.onmousedown = () => {
	down = true;
	vx = 0;
	cancelAnimationFrame(af);
};
onmousemove = e => {
	if (!down || e.buttons != 1) return;
	out.scrollBy(vx = -e.movementX, 0);
};
onmouseup = () => {
	down = false;
	if (Math.abs(vx) < 3) return;
	vx *= 2;
	flick();
};

function flick() {
	if (Math.abs(vx) < 1) return;
	out.scrollBy(vx *= 0.93, 0);
	af = requestAnimationFrame(flick);
}
