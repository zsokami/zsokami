/**
 * @param {String} text
 * @param {Boolean} type 可选
 */
function toast(text, type) {
	let id = 'toast';
	if (type != undefined) {
		id += '-' + (type ? 't' : 'f');
	}
	let toast = document.querySelector('[id|=toast]');
	if (toast) {
		toast.id = '';
		toast.innerText = text;
		requestAnimationFrame(() => toast.id = id);
		return;
	}
	toast = document.createElement('div');
	toast.id = id;
	toast.innerText = text;
	toast.onanimationend = function(e) {
		if (e.animationName == 'toast-out') {
			this.remove();
		}
	};
	document.body.append(toast);
}