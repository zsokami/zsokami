const c = document.getElementById('canvas').getContext('2d');
const w = canvas.width = innerWidth;
const h = canvas.height = innerHeight;
const center = {x: w / 2, y: h / 2};

c.textAlign = 'center';
c.textBaseline = 'middle';
c.font = '50px monospace';

let text = '萧十一郎';
let count = 4;
let tw = c.measureText(text).width / count;

let x = -tw;
let ex = center.x - tw * (count - 1) / 2;
let r = tw / 2;
let er = Math.sqrt(w * w + h * h) / 2;
let ox = tw * (count - 1) * 2 / (er - r);
let state = 0;

run();

function run() {
  c.save();
  c.fillStyle = '#000';
  c.fillRect(0, 0, w, h);
  c.beginPath();
  c.arc(x, center.y, r, 0, 2 * Math.PI);
  c.clip();
  c.clearRect(0, 0, w, h);
  c.fillStyle = '#f00';
  c.fillText(text, center.x, center.y);
  c.restore();
  switch(state) {
    case 0:
      x += 4;
      if(x >= ex) {
        x = ex;
        ex += tw;
        count--;
        state = 1;
      }
      setTimeout(run, 20);
      break;
    case 1:
      if(count) {
        x += 4;
        state = 0;
      }else {
        state = 2;
      }
      setTimeout(run, 800);
      break;
    case 2:
      if(r < er) {
        r += 4;
        x -= ox;
        setTimeout(run, 20);
      }
  }
}

canvas.ontouchstart = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e = e.targetTouches[0];
  c.fillStyle = '#0f0';
  c.beginPath();
  c.arc(e.clientX, e.clientY, 10, 0, 2 * Math.PI);
  c.fill();
}