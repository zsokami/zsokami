var ctx=document.getElementById("canvas").getContext("2d");
var w=canvas.width=window.innerWidth;
var h=canvas.height=window.innerHeight;
var lineW=2;

ctx.fillStyle="#000";
ctx.fillRect(0,0,w,h);

ctx.lineWidth=lineW;

for(var x=lineW/2;x<w;x+=lineW){
  ctx.strokeStyle=getColor(x/w);
  ctx.beginPath();
  ctx.moveTo(x,0);
  ctx.lineTo(x,h);
  ctx.stroke();
}

function getColor(a){
  var green=(Math.floor(a*255)<<8).toString(16);
  return "#ff0000".slice(0,-green.length)+green;
}



