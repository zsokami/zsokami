HTMLElement.prototype.get = function(property) {
	const value = getComputedStyle(this).getPropertyValue(property).trim();
	return value == 'none' ? '' : value;
}
HTMLElement.prototype.transformBy = function(transform) {
	this.style.transform = transform + this.get('transform');
}
HTMLElement.prototype.rotate = function(axis, deg) {
	this.style.transitionDuration = `.3s`;
	this.transformBy(`rotate${axis}(${deg}deg)`);
}
HTMLElement.prototype.end = function() {
	this.style.transitionDuration = '';
	this.transformBy(`rotate(0)`);
}


const mover = document.querySelector('.mover');
const rotor = document.querySelector('.rotor');
const step = 90 / parseInt(rotor.get('--magic-cube-size'));


const A = [
	['Y', 'X', 1, 0],
	['Y', 'X', 1, 1],
	['Y', 'Z', 1, 0],
	['Y', 'Z', 1, 1],
	['Z', 'X', 1, 0],
	['Z', 'X', 0, 0]
];

const pieces = three(Array.from(document.getElementsByClassName('piece'))).map(i => three(i));
for (let z = 0; z < 3; z++)
	for (let y = 0; y < 3; y++)
		for (let x = 0; x < 3; x++) {
			let piece = pieces[z][y][x];
			piece.ontransitionend = piece.end;
			Object.assign(piece, { x, y, z });
			piece.childNodes.forEach((face, i) => face.i = i);
		}


function three(a) {
	let n = a.length / 3;
	return [a.splice(0, n), a.splice(0, n), a];
}

function swap(f,a,b,c,d,a2,b2,c2,d2) {
	
}

function r(x, y, z, axis, anti) {
	let piece = pieces[z][y][x];
	piece.rotate(axis, anti ? -90 : 90);
	
}

function fix(anti, ...a) {
	if (!anti) {
		a.splice(9, 3, ...a.splice(0, 3, ...a.slice(9)));
		a.splice(6, 3, ...a.splice(3, 3, ...a.slice(6, 9)));
	}
	let t = pieces[a[2]][a[1]][a[0]];
	for (let i = 0; i < 9;i+=3) {
		let [x,y,z,x2,y2,z2]=a.slice(i,i+6);
		Object.assign(pieces[z][y][x] = pieces[z2][y2][x2], {x,y,z});
	}
	let [x,y,z]=a.slice(9);
	Object.assign(pieces[z][y][x] = t, {x,y,z});
}

function rot(x, y, z, axis, anti) {
	let func1, func2;
	switch (axis) {
		case 'X':
			func1 = (i, j) => r(x, i, j, axis, anti);
			func2 = (i, j) => fix(anti, x, i, 0, x, 2, i, x, j, 2, x, 0, j);
			break;
		case 'Y':
			func1 = (i, j) => r(i, y, j, axis, anti);
			func2 = (i, j) => fix(anti, 0, y, i, i, y, 2, 2, y, j, j, y, 0);
			break;
		case 'Z':
			func1 = (i, j) => r(i, j, z, axis, anti);
			func2 = (i, j) => fix(anti, i, 0, z, 2, i, z, j, 2, z, 0, j, z);
			break;
	}
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++)
			func1(i, j);
	func2(0, 2);
	func2(1, 1);
}


// setTimeout(() => {
// 	rot(0, 0, 2, 'Z', 0);
// 	setTimeout(() => {
// 		rot(0, 0, 2, 'Y', 0);
// 		setTimeout(() => {
// 			rot(0, 0, 2, 'X', 0);
// 		}, 1000);
// 	}, 1000);
// }, 1000);
// addEventListener('mousemove', mousemove);
// pieces.forEach(piece => {
// 	// piece.addEventListener('mousemove', mousemove);
// });
// function mousemove(e) {
// 	console.log(e.offsetX +' '+e.offsetY);
// }



// function rotX(x, deg) {
// 	for (let i = x; i < 27; i += 3)
// 		rot(i, 'X', deg);
// }

// function rotY(y, deg) {
// 	for (let j = 3 * ++y; j <= 27; j += 9)
// 		for (let i = j - 3; i < j; i++)
// 			rot(i, 'Y', deg);
// }

// function rotZ(z, deg) {
// 	for (let i = 9 * z, j = i + 9; i < j; i++)
// 		rot(i, 'Z', deg);
// }

// function rot(i, axis, deg) {

// 	for (let j = 0; j < 3; j++)
// 	for(let k=0;k<3;k++)

// }

let ot, ox, oy;
let cubeDowned, downX, downY, downFace;
let state;

// let autoRotInterval = setInterval(autoRot, 16);

onmousedown = function(e) {
	// clearInterval(autoRotInterval);
	ox = e.x;
	oy = e.y;
	ot = rotor.get('transform');
	cubeDowned = false;
}

rotor.onmousedown = function(e) {
	e.preventDefault();
	e.stopPropagation();
	cubeDowned = true;
	if (state!=2) {
		downX = e.offsetX;
	downY = e.offsetY;
	downFace = e.target;
	state=1;
	}
}

onmousemove = function(e) {
	if (!e.buttons) return;
	if (cubeDowned) {
		if (e.target != downFace||state != 1) return;
		let x = e.offsetX;
		let y = e.offsetY;
		if (Math.hypot(x - downX, y - downY) > 20) {
			let p = downFace.parentNode,
			 dir = calcDir({x, y},{x:downX,y:downY}),
			 a = A[downFace.i],
			 b = dir & 1,c=dir >>1;
			rot(p.x, p.y, p.z, a[b],c^a[b|2]);
			state = 2;
			setTimeout(() => state = 0, 500);
		}
	} else {
		let dx = e.x - ox;
		let dy = e.y - oy;
		rotor.style.transform = `rotate3d(${-dy}, ${dx}, 0, ${step * Math.hypot(dx, dy)}deg)` + ot;
	}
}

onmouseup = function(e) {
	// autoRotInterval = setInterval(autoRot, 16);
	cubeDowned = false;
}

// 鼠标滑轮控制缩放(沿Z轴平移)
onmousewheel = function(e) {
	mover.transformBy(`translateZ(${-e.deltaY}px)`);
}

// function autoRot() {
// 	rotor.style.transform = `rotate3d(0, 0.866, -0.5, 0.5deg)` + rotorCss.transform;
// }


// 计算p1相对于p2的方向: 0 左, 1 上, 2 右, 3 下
function calcDir(p1, p2) {
	let
		x = p1.x - p2.x,
		y = p1.y - p2.y,
		a = x > y,
		b = x > -y;
	return a ^ b | b << 1;
}