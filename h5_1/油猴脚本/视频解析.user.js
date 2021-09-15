// ==UserScript==
// @name         视频解析
// @version      1.1
// @description  视频解析-随心悬浮球
// @author       Mannix Zhong
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.letv.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.miguvideo.com/*
// @match        *://*.acfun.cn/*
// @match        *://*.bilibili.com/*
// @match        *://*.pptv.com/*
// @match        *://*.yinyuetai.com/*
// @match        *://*.fun.tv/*
// @match        *://*.56.com/*
// @match        *://*.wasu.cn/*
// @match        *://v.qq.com/*
// @match        *://film.sohu.com/*
// @match        *://tv.sohu.com/*
// @match        *://vip.1905.com/*
// @run-at       document-end
// ==/UserScript==

if (top == this && !this._$视频解析_by_Mannix_Zhong$_) {
	this._$视频解析_by_Mannix_Zhong$_ = 1;

	const API =
		`
		1907 https://z1.m1907.cn/?jx=
		黑云 https://jiexi.380k.com/?url=
		高科技 https://jx.du2.cc/?url=
		OK https://okjx.cc/?url=
		金桥 https://jqaaa.com/jx.php?url=
		beac https://beaacc.com/api.php?url=
		17K云 https://17kyun.com/api.php?url=
		云网 https://www.41478.net/?url=
		8090 https://www.8090g.cn/jiexi/?url=
		618G https://jx.618g.com?url=
		无名小站 https://www.administratorw.com/video.php?url=
		思古 https://www.2692222.com/?url=
		千叶 https://yi29f.cn/vip.php?url=
		H8 https://www.h8jx.com/jiexi.php?url=
		60 https://jx.fo97.cn/?url=
		诺讯 https://www.nxflv.com/?url=
		ha12 https://py.ha12.xyz/sos/index.php?url=
		凉城 https://jx.mw0.cc/?url=
		通用 https://jx.598110.com/index.php?url=
		初心 https://jx.18mv.club/18mv.php?url=
		暮光 https://muguang.mgtv.com.muguangys.com/jiexi.php?url=
		乐多 https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=
		月亮 https://vip.jianjians.com/?url=
		神马 https://jxx.smys8.cn/index.php?url=
		口袋 https://jx.4kdv.com/?url=
		影视 https://api.jhdyw.vip/?url=
		久播 https://vip.jiubojx.com/vip/?url=
		七夕 https://1.api.80tvs.cn/?url=
		木穆 https://jx.m3u8.tv/jiexi/?url=
		哔哩 https://www.mtosz.com/m3u8.php?url=
		PAR https://jx.parwix.com:4433/player/?url=
		CKP https://www.ckplayer.vip/jiexi/?url=
		年报 https://jx.nbjx.cc/?url=
		刺客 https://ckmov.ccyjjd.com/ckmov/?url=
		依齐 https://www.1717yun.com/beiyong/?url=
		依托 https://jiexi.us/?url=
		沐白 https://www.miede.top/jiexi/?url=
		金鸡 https://jjxx.me/?url=
		达人 https://vip12vip/m3u8.php?url=3kan.
		宝莲 https://danmu.8old.cn/vip/?url=
		柚子 https://jiexi.jiexizhuanyong.com/?url=
		爱跟 https://vip.2ktvb.com/player/?url=
		呆呆 https://jx.daidaitv.top:43810/?url=
		老版 https://vip.laobandq.com/jiexi.php?url=
		零七 https://jx.pchj.net/parwix/analysis.php?v=
		方案 https://json.iopenyun.com:33/cms_m3u8_api.php?url=
		七彩 https://www.xymav.com/?url=
		猪蹄 https://jx.iztyy.com/svip/?url=
		法克 https://jx.4321s.cc/?url=
		沐白 https://www.miede.top/?url=
		爱酷 http://www.ikukk.com/?ac=0&url=
		`
		.trim().split('\n')
		.map(i => i.match(/\s*(.*\S)\s*(https?:\/\/.+?\?.+?=)/))
		.map(i => { return { name: i[1], url: i[2] } });

	const em = innerWidth > screen.width ? devicePixelRatio * 16 : 16;
	const d = i => i * em + 'px';

	// 列表
	const list = document.createElement('div');
	document.body.appendChild(list);
	css(list,
		`background: white;
		max-width: 50%;
		height: auto;
		margin: ${d(1)};
		box-shadow: 0 0 ${d(0.5)} rgba(0, 0, 0, 0.3);
		position: fixed;
		z-index: 2147483647;
		overflow: hidden;
		border-radius: ${d(0.5)};
		transform: scale(0.9);
		opacity: 0`
	);
	const container = document.createElement('div');
	list.appendChild(container);
	css(container,
		`background: none;
		height: 100%;
		padding: ${d(0.5)};
		box-sizing: border-box;
		overflow: auto`
	);
	API.forEach(i => {
		// 项目
		const a = document.createElement('a');
		container.appendChild(a);
		css(a,
			`font-size: ${d(1)};
			background: none;
			height: auto;
			line-height: normal;
			text-decoration: none;
			color: unset;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			border-radius: ${d(0.5)};
			padding: ${d(0.5)}`
		);
		a.href = i.url;
		a.target = '_blank';
		// 项目符号
		const span = document.createElement('span');
		a.appendChild(span);
		css(span,
			`display: inline-block;
			vertical-align: middle;
			font-size: ${d(0.5625)};
			width: ${d(1.125)};
			height: ${d(1.125)};
			line-height: ${d(1.125)};
			text-align: center;
			margin-right: ${d(0.5)};
			color: white;
			border-radius: 50%;
			box-shadow: 0px 0px ${d(0.3)} #bbb;
			background: #${i.ad?'f43':'07f'}`
		);
		span.innerHTML = '★';
		a.innerHTML += i.name;
		a.onclick = itemClick;
		a.onpointerenter = itemEnter;
		a.onpointerleave = itemLeave;
	});

	function itemClick() {
		this.search = this.search.replace(/(https?:\/\/.+)?$/, location.href);
	}

	function itemEnter() {
		css(this, 'color: yellow; background: #373737');
	}

	function itemLeave() {
		css(this, 'color: unset; background: none');
	}

	// 悬浮按钮
	const btn = document.createElement('div');
	document.body.appendChild(btn);
	css(btn,
		`font-size: ${d(1)};
		background: white;
		width: ${d(3)};
		height: ${d(3)};
		line-height: ${d(3)};
		text-align: center;
		border-radius: 50%;
		box-shadow: 0 0 ${d(0.5)} rgba(0, 0, 0, 0.3);
		position: fixed;
		left: calc(80% - ${d(1.5)});
		top: calc(80% - ${d(1.5)});
		z-index: 2147483647;
		user-select: none;
		transition: transform 0.3s`
	);
	btn.innerHTML = '➕';

	// 列表外边距
	const [ml, mt, mr, mb] = 'marginLeft marginTop marginRight marginBottom'.split(' ')
		.map(i => parseFloat(getComputedStyle(list)[i]));
	// 列表总高度
	const h = container.scrollHeight;
	css(list, 'display: none');
	// 悬浮按钮半宽高
	const [halfW, halfH] = [btn.offsetWidth / 2, btn.offsetHeight / 2];
	const freeH = halfH + mt + mb;
	// 窗口宽高与中心(可变)
	let fw, fh, cx, cy;

	let down, moved, dx, dy, ox, oy;

	event(this, 'resize', () => {
		fw = Math.min(document.documentElement.clientWidth, innerWidth);
		fh = Math.min(document.documentElement.clientHeight, innerHeight);
		cx = fw / 2;
		cy = fh / 2;
		if (list.style.display != 'none') updatePos();
	})();

	if ('ontouchstart' in btn) {
		event(btn, 'touchstart', e => onDown(e.targetTouches[0]));
		event(btn, 'touchmove', e => onMove(e.targetTouches[0]));
		event(btn, 'touchend', onUp);
	} else {
		event(btn, 'mousedown', e => (down = true, onDown(e)));
		event(this, 'mousemove', onMove, e => down && e.buttons);
		event(this, 'mouseup', () => (down = false, onUp()), () => down);
	}

	function onDown(p) {
		dx = p.clientX;
		dy = p.clientY;
		ox = btn.offsetLeft + halfW;
		oy = btn.offsetTop + halfH;
		moved = false;
	}

	function onMove(p) {
		const [mx, my] = [p.clientX - dx, p.clientY - dy];
		css(btn,
			`left: calc(${100*Math.min(Math.max(ox+mx,halfW),fw-halfW)/fw}% - ${halfW}px);
			top: calc(${100*Math.min(Math.max(oy+my,halfH),fh-halfH)/fh}% - ${halfH}px)`
		);
		if (list.style.display != 'none') updatePos();
		if (!moved && Math.hypot(mx, my) > 10) moved = true;
	}

	function onUp() {
		if (!moved) {
			if (list.style.opacity == 0) {
				css(btn, 'transform: scaleZ(1) rotateZ(45deg)');
				css(list, 'display: block; transition: none');
				updatePos();
				requestAnimationFrame(() => requestAnimationFrame(() => css(list, 'transform: none; opacity: 1; transition: 0.3s')));
			} else {
				css(btn, 'transform: none');
				css(list, 'transform: scale(0.9); opacity: 0');
				setTimeout(() => list.style.opacity == 0 && css(list, 'display: none'), 300);
			}
		}
	}

	function updatePos() {
		const [bx, by] = [btn.offsetLeft + halfW, btn.offsetTop + halfH];
		let left, top, nh, ax, ay;
		if (bx < cx) {
			left = `${btn.style.left}`;
			ax = 'left';
		} else {
			left = `calc(${100*bx/fw}% - ${list.offsetWidth+ml+mr-halfW}px)`;
			ax = 'right';
		}
		if (by < cy) {
			nh = Math.min(fh - by - freeH, h);
			top = `calc(${100*by/fh}% + ${halfH}px)`;
			ay = 'top';
		} else {
			nh = Math.min(by - freeH, h);
			top = `calc(${btn.style.top} - ${nh+mt+mb}px)`;
			ay = 'bottom';
		}
		css(list, `left: ${left}; top: ${top}; height: ${nh}px; transform-origin: ${ax} ${ay}`);
	}

	// 辅助函数

	function event(ele, types, listener, filter) {
		const l = filter ?
			e => filter(e) && (e && e.preventDefault(), listener(e)) :
			ele == this ? listener :
			e => (e && e.preventDefault(), listener(e));
		types.match(/\S+/g).forEach(type => ele.addEventListener(type, l));
		return l;
	}

	function css(ele, css) {
		ele.style.cssText += css;
	}
}
