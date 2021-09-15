var ctx=document.getElementById("canvas").getContext("2d");
var w=canvas.width=window.innerWidth;
var h=canvas.height=window.innerHeight;
var cx=w/2,cy=h/2;
var lineW=10;
var r=20;

var points=[];

ctx.lineWidth=lineW;
ctx.strokeStyle="#f00";

function drawLiness(x,y,ang,len,count){
  if(count<=0)return;
  x+=Math.cos(ang)*len;
  y+=Math.sin(ang)*len;
  ctx.lineTo(x,y);
  points.push({x:x,y:y});
  drawLiness(x,y,ang+Math.random()*2-1,len,count-1);
}

function draw(){
  points=[];
  ctx.fillStyle="#000";
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#f00";
  ctx.beginPath();
  for(var i=0;i<10;i++){
    ctx.moveTo(cx,cy);
    drawLiness(cx,cy,Math.random()*Math.PI*2,100,8);
  }
  ctx.stroke();
  /*
  for(var i in points){
    ctx.beginPath();
    ctx.arc(points[i].x,points[i].y,r,0,Math.PI*2);
    ctx.fill();
  }*/
}
//draw();
setInterval(draw,200);


