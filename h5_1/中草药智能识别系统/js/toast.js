const toast = (() => {
	let toast;
	
	/**
	 * @param {String} text
	 * @param {Boolean} type 可选
	 */
	return function(text, type) {
		let id = 'toast';
		if (type != undefined) {
			id += '-' + (type ? 't' : 'f');
		}
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
				toast = null;
			}
		};
		document.body.append(toast);
	};
})();
