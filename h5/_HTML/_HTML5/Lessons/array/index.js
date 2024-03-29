//输出数组
var arr = ['a', 'b', 'c', 'd', 'e'];

gen(arr);

write('<div>');

//方法一
write('一: ');

for(var i = 0; i < arr.length; i++) {
  write(arr[i] + ',');
}

//方法二
write('<br>二: ');

for(var i in arr) {
  write(arr[i] + ',');
}

//方法三
write('<br>三: ');

var i = 0;
while(1) {
  write(arr[i]);
  if(++i >= arr.length) break;
  write(',');
}

//方法四
write('<br>四: ');

write(arr.join(','));

//方法五
write('<br>五: ');

write(arr);

write('</div>');

/****************/

function write(s) {
  document.write(s);
}

function gen(arr) {
  for(var i = 0; i < 26; i++)
    arr[i] = String.fromCharCode(97 + i);
}

/*
function random(min, max) {
  if(max < min) {
    var tmp = min;
    min = max;
    max = tmp;
  }
  return min + parseInt(Math.random() * (max - min + 1));
}
*/