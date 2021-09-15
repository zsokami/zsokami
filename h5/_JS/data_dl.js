function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)
	while(n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new Blob([u8arr], {
		type: mime
	});
}

function downloadFile(url, name = 'What\'s the fuvk') {
	var a = document.createElement("a")
	a.setAttribute("href", url)
	a.setAttribute("download", name)
	a.setAttribute("target", "_blank")
	a.innerText = name
	a.style.display = 'block'
	document.body.insertAdjacentElement('beforeend', a)
	//	let clickEvent = document.createEvent("MouseEvents");
	//	clickEvent.initEvent("click", true, true);
	//	a.dispatchEvent(clickEvent);
}

function downloadFileByBase64(base64, name) {
	var myBlob = dataURLtoBlob(base64)
	var myUrl = URL.createObjectURL(myBlob)
	downloadFile(myUrl, name)
}

let res = document.getElementById(Runner.config.RESOURCE_TEMPLATE_ID).content;

for(var sound in Runner.sounds) {
	var src = res.getElementById(Runner.sounds[sound]).src;
	downloadFileByBase64(src, sound);
}