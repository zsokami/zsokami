var t=new Date().getTime();
var i;
for(i=0;i<1000000000;i++);
document.write(i);
document.write("<br>");
document.write(new Date().getTime()-t);
alert("\n 1\t"==1);