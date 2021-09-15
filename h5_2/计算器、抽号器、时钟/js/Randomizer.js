let min, max, noRepeat, times;
let nums; // 存放待抽取的数
let randIdx = -1; // 每次随机抽取的数位置

btn.onclick = function() {
	if (btn.value == '开始') {
		const [min_, max_, noRepeat_] = [getValue(inMin, 1), getValue(inMax, 60), inNoRepeat.checked];
		times = getValue(inTimes, 1);
		if (min != min_ || max != max_ || noRepeat != noRepeat_) {
			[min, max, noRepeat] = [min_, max_, noRepeat_];
			init();
		}
		start();
	} else {
		stop();
	}
};

warning.onanimationend = function() {
	this.innerText = '';
	this.style.animation = '';
};

let runID, stopID;
let nextTime;
let slow;

function run() {
	runID = requestAnimationFrame(run);
	if (slow > 0) {
		if (new Date() < nextTime)
			return;
		slow *= 1 + Math.random() * 1.5;
		nextTime += slow;
	}
	out.innerText = randGet(nums);
	out.style.transform = `scale(1.3) translate(${randi(-10, 10)}px, ${randi(-10, 10)}px)`;
}

function run2() {
	if (!realStart())
		return;
	out.style.transition = 'color 0.3s';
	out.style.color = 'dodgerblue';
	out.ontransitionend = e => {
		realStop();
		out.style.transform = 'scale(1.3)';
		if (--times > 0) {
			out.style.color = '#f42';
			out.ontransitionend = run2;
		} else {
			stopID = setTimeout(stop, 300);
		}
	};
}

function start() {
	btn.value = '停止';
	if (~randIdx) {
		realStop();
	}
	out.style.animation = '';
	out.onanimationend = null;
	requestAnimationFrame(() => requestAnimationFrame(() => {
		out.style.transform = 'scale(1.3)';
		out.style.color = '#f42';
		out.style.transition = 'transform 0.5s, color 0.5s 0.5s';
		out.ontransitionend = e => {
			if (e.propertyName == 'color') {
				if (times < 2) {
					realStart();
				} else {
					run2();
				}
			}
		};
	}));

}

function stop() {
	btn.value = '开始';
	clearTimeout(stopID);
	if (randIdx < 0) {
		out.style.transform = '';
		out.style.color = 'dodgerblue';
		out.style.transition = '0.5s';
		out.ontransitionend = null;
		return;
	}
	slowDown();
	out.style.color = 'dodgerblue';
	out.style.transition = 'color 0.5s';
	out.ontransitionend = e => {
		if (e.propertyName == 'color') {
			realStop();
			out.style.transform = 'scale(1.3)';
			out.style.animation = 'flash 0.5s';
			out.onanimationend = function() {
				out.style.animation = '';
				out.style.transform = '';
				out.style.transition = 'transform 0.5s';
			}
		}
	};
}

function realStart() {
	if (noRepeat) {
		if (nums.length < 2) {
			if (nums.length == 1) {
				out.innerText = nums[randIdx = 0];
				stop();
				warning.innerText = '已抽完一组数了';
				warning.style.animation = 'up 1s 2 alternate';
				return false;
			}
			init(); // 抽完则进行新一轮初始化
		}
	}
	out.style.transition = '';
	slow = 0;
	run();
	return true;
}

function slowDown() {
	slow = 15;
	nextTime = +new Date() + slow;
}

function realStop() {
	cancelAnimationFrame(runID);
	runID = 0;
	historyResult.innerText += ' ' + out.innerText;
	if (noRepeat)
		nums.splice(randIdx, 1); // 删除已被抽取的数
	randIdx = -1;
}

function init() {
	nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

function getValue(input, defaultValue) {
	return input.checkValidity() ? parseInt(input.value) : defaultValue;
}

function randGet(a) { // 随机获取数组元素
	return a[randIdx = randi(a.length)];
}

function randi(...m) { // 随机整数 1参区间:[0, m[0]), 2参区间:[m[0], m[1]]
	let r = Math.random();
	return (m.length > 1 ? m[0] + r * (m[1] - m[0]) + 1 : r * (m[0] || 0x7fffffff)) | 0;
}
