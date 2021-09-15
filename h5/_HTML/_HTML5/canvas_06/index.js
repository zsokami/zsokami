var ctx=document.getElementById("canvas").getContext("2d");
var w=canvas.width=window.innerWidth;
var h=canvas.height=window.innerHeight;
var cx=w/2,cy=h/2;
var th=50;
var mr=400;
var linew=6;
var y=-th,r=0,roffset=10,s,angle=0,len=0;
var colors=[];


var p=0;

ctx.font="100px monospace";
ctx.shadowColor="#f00";
ctx.lineWidth=linew;
ctx.strokeStyle="#f00";

ctx.fillStyle="#000";
ctx.fillRect(0,0,w,h);

function draw(){
  switch(p){
    case 0:
      ctx.fillStyle="rgba(0,0,0,0.2)";
      ctx.fillRect(0,0,w,h);
      ctx.fillStyle="#f00";
      ctx.fillRect(0,y,w,th);
      ctx.shadowBlur=50;
      ctx.fillText("前方高能(滑稽)",cx-400,cy+50);
      ctx.shadowBlur=0;
      ctx.fillStyle="#000";
      ctx.fillRect(0,y+th,w,h-y-th);
      if(y>h+200)p++;
      else y+=10;
      break;
    case 1:
      ctx.fillStyle="rgba(0,0,0,0.2)";
      ctx.fillRect(0,0,w,h);
      ctx.fillStyle="#fff";
      ctx.beginPath();
      ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.fill();
      if(r>=mr)roffset=-roffset;
      r+=roffset;
      if(r<=0){
        p++;
        roffset=30;
        for(var i=0;i<16;i++){
          colors[i]=rndColor();
        }
      }
      break;
    case 2:
      ctx.fillStyle="rgba(0,0,0,0.2)";
      ctx.fillRect(0,0,w,h);
      r+=roffset*=0.95;
      var j=0;
      s=r/4;
      var ang=Math.PI/8,max=Math.PI*2;
      for(var i=0;i<max;i+=ang,j++){
        ctx.fillStyle=sColor(colors[j],s);
        ctx.beginPath();
        ctx.arc(cx+Math.cos(i)*r,cy+Math.sin(i)*r,r/mr*30,0,max);
        ctx.fill();
      }
      if(r>=mr)p++;
      break;
    case 3:
      ctx.fillStyle="#000";
      ctx.fillRect(0,0,w,h);
      var j=0;
      s-=2;
      var ang=Math.PI/8,max=Math.PI*2;
      for(var i=0;i<max;i+=ang,j++){
        ctx.fillStyle=sColor(colors[j],s);
        ctx.beginPath();
        ctx.arc(cx+Math.cos(i)*r,cy+Math.sin(i)*r,r/mr*30,0,max);
        ctx.fill();
      }
      if(s<0)p++;
      /*
      p--;
      r=0;
      roffset=30;
      for(var i=0;i<16;i++){
        colors[i]=rndColor();
      }
      */
      break;
    case 4:
      len+=40;
      if(len>=mr-30){
        drawLine(cx,cy,angle,mr-30);
        len=0;
        angle+=Math.PI/8;
        if(angle>=Math.PI*2){
          p++;
          angle=0;
        }
      }else{
        drawLine(cx,cy,angle,len);
      }
      break;
    case 5:
      ctx.fillStyle="#000";
      ctx.fillRect(0,0,w,h);
      angle+=Math.PI/64;
      var ang=Math.PI/8,max=Math.PI*2+angle;
      var l=mr-30;
      for(var i=angle;i<max;i+=ang){
        drawLine(cx,cy,i,l);
        ctx.fillStyle=sColor("#ff8000",(i/Math.PI-2)*100);
        ctx.beginPath();
        ctx.arc(cx+Math.cos(i)*mr,cy+Math.sin(i)*mr,30,0,max);
        ctx.fill();
      }
      break;
    case 6:
      
      break;
  }
}

setInterval(draw,50);

function drawLine(x,y,ang,len){
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x+Math.cos(ang)*len,y+Math.sin(ang)*len);
  ctx.stroke();
}

function rndColor(){
  var h=Math.floor(Math.random()*1530);
  var a=h%255,b=(h-a)/255,c=b%2,d=(b+1)%3;
  var e=((255<<(d+c+1)%3*8)|((c?255-a:a)<<d*8)).toString(16);
  return "#000000".slice(0,-e.length)+e;
}

function sColor(c,s){
  if(s<0)s=0;
  else if(s>100)s=1;
  else s/=100;
  var v=255*(1-s);
  var r=v+parseInt(c.substr(1,2),16)*s;
  var g=v+parseInt(c.substr(3,2),16)*s;
  var b=v+parseInt(c.substr(5,2),16)*s;
  c=((r<<16)|(g<<8)|b).toString(16);
  return "#000000".slice(0,-c.length)+c;
}




