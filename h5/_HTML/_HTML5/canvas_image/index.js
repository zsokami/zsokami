const c = canvas.getContext('2d');
const w = canvas.width = innerWidth;
const h = canvas.height = innerHeight;
const cx = w / 2, cy = h / 2;

let scale = 1;

img_items = new Image();
img_items.src = 'img/item.png';
img_items.onload = function() {
  drawImage(this);
};

canvas.ontouchstart = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e = e.targetTouches[0];
  if(scale >= 8)scale = 0.25;
  else scale *= 2;
  drawImage(img_items);
}

function drawImage(img) {
  c.clearRect(0, 0, w, h);
  c.drawImage(img, 0, 0, img.width * scale, img.height * scale);
}