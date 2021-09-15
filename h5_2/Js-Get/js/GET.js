const GET = location.search.slice(1).split('&').map(i => i.split('='))
	.reduce((GET, [k, v]) => (GET[k] = isNaN(v) ? decodeURIComponent(v) : parseFloat(v), GET), {});
