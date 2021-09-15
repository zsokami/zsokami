function svg2url(svg) {
	return 'data:image/svg+xml;,' + svg.trim()
		.replace(/\s*[\r\n]+\s*|(?<=<\/?)\s+|\s+(?=<|\/?>)/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/"/g, '\'')
		.replace(/(?<=<svg)(?=(?:(?!xmlns).)*?>)/, ' xmlns=\'http://www.w3.org/2000/svg\'');
}
