var color=0xff0000;
var i=0;
var o=-17;
function changeColor(){
	var tmp=(color>>(i<<3))&255;
	if(tmp<=0||tmp>=255){
		i=(i+1)%3;
		o=-o;
	}
	color+=o*Math.pow(256,i);
	var s=color.toString(16);
	var count=6-s.length;
	while(count-- >0)s='0'+s;
	txt.color='#'+s;
}
setInterval(changeColor,50);