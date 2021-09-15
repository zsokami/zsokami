let textShadows = [];
for(let i = 0; i <= 120; i++) {
	textShadows.push(`0px ${-i*2}px ${5+i}px hsl(${360-i*3},100%,${95-45*i/120}%)`);
}
t1.style.textShadow = textShadows.join();

textShadows.length = 0;

for(let i = 0; i <= 60; i++) {
	textShadows.push(`${i}px ${i*2}px hsl(0,0%,${85-i}%)`);
}
textShadows.push('60px 120px 30px black');
t2.style.textShadow = textShadows.join();

let c = canvas.getContext('2d');
let font = 'bold 5em sans-serif';
c.font = font;
let {
	actualBoundingBoxLeft: left,
	actualBoundingBoxRight: right,
	actualBoundingBoxAscent: ascent,
	actualBoundingBoxDescent: descent
} = c.measureText(canvas.innerHTML);

canvas.width = right - left;
canvas.height = ascent + descent;
c.font = font;

let lg = c.createLinearGradient(0, 0, canvas.width, 0);
for(let i = 0; i < 360; i += 40) {
	lg.addColorStop(i / 360, `hsl(${i+40},100%,50%)`);
	lg.addColorStop((i + 40) / 360, `hsl(${i},100%,50%)`);
}
c.fillStyle = lg;
c.fillText(canvas.innerHTML, -left, ascent);

lg = c.createLinearGradient(0, 0, canvas.width, 0);
lg.addColorStop(0, 'black');
lg.addColorStop(1, 'white');
c.strokeStyle = lg;
c.lineWidth = 2;
c.strokeText(canvas.innerHTML, -left, ascent);

function rnd(n, m) {
	return n + (m - n) * Math.random();
}
