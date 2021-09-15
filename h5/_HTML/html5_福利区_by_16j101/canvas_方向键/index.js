var ctx=document.getElementById("canvas").getContext("2d");
var w=canvas.width=screen.width-100,h=canvas.height=screen.height-200;
var zero={x:0,y:0};
var cp={x:w/2,y:h/2};
var sp={x:cp.x+h/4,y:cp.y};
var off=[
	{x:-h/4,y:-h/4}
	,{x:0,y:h/8}
	,{x:-h/4,y:0}
	,{x:0,y:h/4}
	,{x:h/4,y:0}
	,{x:0,y:h/8}
]
var mAngle=0;
var tAngle=-1;
var func,param;

var down=0;

var arc={
	cx:50,
	cy:50,
	r:30,
	angle1:0,
	angle2:Math.PI,
	dir:0,
	draw:function(ctx){
		ctx.beginPath();
		ctx.arc(this.cx,this.cy,this.r,this.angle1,this.angle2,this.dir);
		ctx.lineWidth=5;
		ctx.strokeStyle="#0ff";
		ctx.stroke();
	},
	off1:function(value){
		this.angle1+=value;
		this.update();
	},
	off2:function(value){
		this.angle2+=value;
		this.update();
	},
	update:function(){
		var c=Math.PI*2;
		this.dir=((this.angle2=(this.angle2%c+c)%c)-(this.angle1=(this.angle1%c+c)%c)+c)%c>=Math.PI;
	}
}

clear();

document.onkeydown=function(e){
	var code=e.keyCode-37;
	switch(code){
		case 0:arc.off1(-0.2);break;
		case 1:arc.off2(-0.2);break;
		case 2:arc.off1(0.2);break;
		case 3:arc.off2(0.2);break;
		default:return;
	}
	tAngle=Math.PI*(1+0.5*code);
}

document.onkeyup=function(e){
	tAngle=-1;
}

function clear(){
	ctx.fillStyle="#000";
	ctx.fillRect(0,0,w,h);
}

function draw(angle){
	var p=rotate(sp,cp,angle);
	ctx.beginPath();
	ctx.moveTo(p.x,p.y);
	for(var i in off){
		var pp=rotate(off[i],zero,angle);
		p.x+=pp.x;
		p.y+=pp.y;
		ctx.lineTo(p.x,p.y);
	}
	ctx.closePath();
	ctx.fillStyle="#fff";
	ctx.fill();
}

function rotate(p1,p2,angle){
	var xx=p1.x-p2.x,yy=p1.y-p2.y;
	var d=Math.sqrt(xx*xx+yy*yy);
	angle+=Math.atan2(yy,xx);
	return {x:p2.x+Math.cos(angle)*d,y:p2.y+Math.sin(angle)*d};
}

function run(){
	clear();
	arc.draw(ctx);
	draw(mAngle);
	mAngle+=0.05;
}

setInterval(run,50);












