function include(url) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, false);
	xhr.send();
	document.currentScript.remove();
	document.write(xhr.responseText);
}
