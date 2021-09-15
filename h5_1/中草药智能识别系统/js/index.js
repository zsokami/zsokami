/**
 * @param {Element} parent
 * @param {Function} fn
 */
function setOnItemClick(parent, fn) {
	[...parent.children].forEach(item => item.onclick = fn);
}

/**
 * 创建 单选按钮组 - 选项切换事件
 * @param {Element} radioGroup 单选按钮的父元素
 * @param {Function} fn 事件触发后调用的函数
 */
function createRadioToggle(radioGroup, fn) {
	setOnItemClick(radioGroup, function(e) {
		if (!this.classList.contains('active')) {
			const old = this.parentElement.querySelector('.active');
			old && old.classList.remove('active');
			this.classList.add('active');
			fn.call(this, e);
		}
	});
	
}

/**
 * 等比例缩小图片
 * @param {Image} img
 * @param {Number} maxPixels 最大像素限制 (宽 * 高)
 */
function scaleDown(img, fn, maxPixels = 500000) {
	const ratio = Math.min(Math.sqrt(maxPixels / (img.naturalWidth * img.naturalHeight)), 1);
	const canvas = document.createElement('canvas');
	canvas.width = img.naturalWidth * ratio;
	canvas.height = img.naturalHeight * ratio;
	canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
	canvas.toBlob(fn, 'image/jpeg');
}

// /**
//  * @param {String} url
//  */
// function dataURL2Blob(url) {
// 	return new Blob([Uint8Array.from(atob(/(?<=,).+/.exec(url)[0]), c => c.charCodeAt())], { type: /(?<=:)[^;,]+/.exec(url)[0] });
// }

// /**
//  * @param {Blob} blob
//  * @param {Function} fn
//  */
// function blob2DataURL(blob, fn) {
// 	const reader = new FileReader();
// 	reader.onload = function() {
// 		fn(this.result);
// 	};
// 	reader.readAsDataURL(blob);
// }