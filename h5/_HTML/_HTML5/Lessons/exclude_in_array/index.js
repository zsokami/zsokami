var min;
var max;
var nums;

//var all;

inputs.append(createInput());

function onClick() {
  var a = n.value || 0, b = m.value || 0;
  if(isInt(a) && isInt(b)) {
    a = parseInt(a);
    b = parseInt(b);
    if(a < b) {
      min = a;
      max = b;
    } else {
      min = b;
      max = a;
    }
    nums = getNums(min, max);
    /*
    all = [];
    for(var i = min, j = 0; i <= max; i++) {
      if(i != nums[j]) all.push(i);
      else j++;
    }
    */
    run();
  }
  //b.innerHTML = b.innerHTML == '抽'? '停': '抽';
}

function run() {
  output.innerHTML = rnd1();
}

/*方法一：
*简单，但有运气成分；
*排除的数很多时，运气不好会耗时；
*排除全部数时将卡死；
*适用于排除的数较少的情况；
*/
function rnd1() {
  var r;
  while(contains(r = random(min, max), nums)); //如果随机的数存在数组中，将重新产生随机数，直到不在数组中为止
  return r;
}

/*方法二：
*先把所有可能的数存入数组，再随机抽取；
*无耗时问题，但范围太大时，会占用大量内存；
*适用于范围较小的情况；
*/
function rnd2() {
  return all[random(0, all.length - 1)];
}

/*方法三：
*完美；
*/
function rnd3() {
  var r = random(min, max - nums.length);
  nums.push(max + 1); //设置哨兵
  var i = 0;
  while(r >= nums[i++]) ++r;
  nums.pop();
  return r;
}

//获取需要排除的数
function getNums(min, max) {
  if(min > max) {
    var t  = min;
    min = max;
    max = t;
  }
  var nums = [];
  var input = inputs.getElementsByTagName('input');
  for(var i = 0; i < input.length; i++) {
    var s = input[i].value;
    //必须是整数
    if(isInt(s)) {
      s = parseInt(s);
      //仅范围内
      if(s >= min && s <= max)
        nums.push(s);
    }
  }
  //升序
  nums.sort(function(a, b) {
    return a - b;
  });
  //去重
  var i = 1;
  while(i < nums.length) {
    if(nums[i] == nums[i - 1])
      nums.splice(i, 1);
    else i++;
  }
  return nums;
}

//判断是否为整数
function isInt(s) {
  return s.match(/^[+-]?\d+/); //匹配整数，仅匹配开头
}

//遍历法查找
function contains(v, array) {
  array.push(v); //设置哨兵
  var i = 0;
  while(array[i++] != v);
  array.pop();
  return i <= array.length;
}

//二分法查找(针对有序数组)
function binarySearch(v, array, start, end) {
  if(start >= end)
    return ~start;
  var mid = (start + end) >>> 1;
  var m = array[mid];
  if(v == m)
    return mid;
  else if(v < m)
    return binarySearch(v, array, start, mid);
  else
    return binarySearch(v, array, mid + 1, end);
}

//随机整数
function random(min, max) {
  if(min > max) {
    var t  = min;
    min = max;
    max = t;
  }
  return Math.floor(min + Math.random() * (max - min + 1));
}

//创建文本框
function createInput() {
  var i = document.createElement('input');
  i.size = 1;
  i.onkeydown = function() {
    this._value = this.value;
  }
  i.oninput = function(e) {
    if(e.data.match(/^[^-+\d\w]$/)) {
      if(!(this.value = this._value)) return;
      this.insertAdjacentElement('afterEnd', createInput());
      this.nextSibling.focus();
    }
  }
  i.onkeyup = function(e) {
    if(e.keyCode == 8 && !this._value) {
      var prev = this.previousSibling;
      if(prev) {
        prev.focus();
        this.remove();
      }
    }
  }
  return i;
}

