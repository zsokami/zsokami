document.querySelectorAll('form>span[for]').forEach(span => {
	this[span.getAttribute('for')].addEventListener('input', function() {
		span.className = this.value == '' ? '': this.checkValidity() ? 'ok' : 'error';
	});
});