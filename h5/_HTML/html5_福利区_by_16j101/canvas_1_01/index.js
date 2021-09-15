var ctx=document.getElementById("canvas").getContext("2d");
var w=canvas.width=screen.width-100;
var h=canvas.height=screen.height-200;
var r=20;
var space=20;
var vel=1;
var headX=30,headY=30;
var angle=0;
var points=[];
var minLen=5;
var len=minLen;

var food;

var turnLeft=0;
var turnRight=0;

var AI=0;
var AI2=0;

rndFood();

ctx.font="50px monospace";
ctx.shadowColor="#fff";
ctx.shadowBlur=10;

function draw(){
	ctx.fillStyle="#000";
	ctx.fillRect(0,0,w,h);
	points.unshift({x:headX,y:headY});
	if(points.length*vel>len){
		points.pop();
	}
	ctx.fillStyle="#fff";
	for(var i=0;i<len;i++){
		var ii=Math.floor(i/vel);
		if(ii>=points.length)break;
		var point=points[ii];
		ctx.beginPath();
		ctx.arc(point.x,point.y,r,0,Math.PI*2);
		ctx.fill();
	}
	var xx=food.x-headX,yy=food.y-headY,dd=Math.sqrt(xx*xx+yy*yy);
	if(dd<r){
		len++;
		rndFood();
	}
	ctx.fillStyle="#ff0";
	ctx.beginPath();
	ctx.arc(food.x,food.y,10,0,Math.PI*2);
	ctx.fill();
	
	ctx.fillStyle="#fff";
	ctx.fillText("得分："+(len-minLen)*10,10,60);
	
	if(turnLeft)angle-=0.5*vel;
	if(turnRight)angle+=0.5*vel;
	if(AI){
		xx=food.x-headX;
		yy=food.y-headY;
		var angle2=Math.atan2(yy,xx);
		if(angle2<0)angle2+=Math.PI*2;
		angle=angle%(Math.PI*2);
		if(angle<0)angle+=Math.PI*2;
		if(angle2!=angle){
			var ang=angle2-angle;
			if(ang<0)ang+=Math.PI*2;
			if(ang<Math.PI)angle=angle+0.5*vel;
			else angle=angle-0.5*vel;
		}
	}else if(AI2){
		xx=food.x-headX;
		yy=food.y-headY;
		var angle2=(Math.atan2(yy,xx)-angle)%(Math.PI*2);
		if(angle2>Math.PI)angle2-=Math.PI*2;
		if(Math.abs(angle2)<0.5*vel)angle+=angle2;
		else if(angle2>0)angle+=0.5*vel;
		else angle-=0.5*vel;
	}
	headX+=Math.cos(angle)*space*vel;
	headY+=Math.sin(angle)*space*vel;
}

setInterval(draw,50);

document.onkeydown=function(e){
	switch(e.keyCode){
		case 37:turnLeft=1;AI=AI2=0;break;
		case 39:turnRight=1;AI=AI2=0;break;
		case 65:AI=!AI;AI2=0;break;
		case 66:AI2=!AI2;AI=0;break;
	}
}

document.onkeyup=function(e){
	switch(e.keyCode){
		case 37:turnLeft=0;break;
		case 39:turnRight=0;break;
	}
}

function rndFood(){
	food={x:Math.random()*w,y:Math.random()*h};
}















