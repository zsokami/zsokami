var color=0xff0000;
var i=0;
var o=-17;
function changeColor(){
	var tmp=(color>>(i<<3))&255;
	if(tmp<=0||tmp>=255){
		i=(i+1)%3;
		o=-o;
	}
	color+=o<<(i<<3);
	var s=color.toString(16);
	txt.color="#000000".slice(0,-s.length)+s;
}
setInterval(changeColor,50);