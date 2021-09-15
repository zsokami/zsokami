/**
 * 创建 单选按钮组 - 选项切换事件
 * 绑定在按钮的父元素点击事件上使用
 * @param {Function} fn 事件触发后调用的函数
 * @return {Function}
 */
function createRadioToggle(fn) {
	return function(e) {
		if (e.path[1] == this && !e.target.classList.contains('active')) {
			this.querySelector('.active').classList.remove('active');
			e.target.classList.add('active');
			fn.call(e.target, e);
		}
	};
}

/**
 * 等比例缩小图片
 * @param {Image} img
 * @param {Number} maxPixels 最大像素限制 (宽 * 高)
 * @return {String}
 */
function scaleDown(img, maxPixels = 500000) {
	const ratio = Math.min(Math.sqrt(maxPixels / (img.naturalWidth * img.naturalHeight)), 1);
	const canvas = document.createElement('canvas');
	canvas.width = img.naturalWidth * ratio;
	canvas.height = img.naturalHeight * ratio;
	canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL('image/jpeg');
}

/**
 * @param {String} url
 */
function dataURL2Blob(url) {
	return new Blob([Uint8Array.from(atob(/(?<=,).+/.exec(url)[0]), c => c.charCodeAt())], { type: /(?<=:)[^;,]+/.exec(url)[0] });
}

/**
 * @param {Blob} blob
 * @param {Function} fn
 */
function blob2DataURL(blob, fn) {
	const reader = new FileReader();
	reader.onload = function() {
		fn(this.result);
	};
	reader.readAsDataURL(blob);
}