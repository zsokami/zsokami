// ==UserScript==
// @name         悬浮控制台
// @version      1.0
// @author       Mannix Zhong
// @match        */*
// @connect      *
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// ==/UserScript==

if (this == top) {
    addMethods();

    const output = createConsole();

    function createConsole() {
        const output = $('textarea').css('display: block; min-width: 300px; min-height: 300px; border: 1px grey; border-style: solid none; outline: none; color: inherit;');
        const panel = $('div').css('display: flex;');
        const cmd = $('textarea').css('resize: none; flex: 1; border: none; outline: none; color: inherit;');
        const btn = $('div').css('padding: 0.5em 1em; text-align: center; line-height: 5em; background: #eee; user-select: none; transition: 0.5s;').text('run').hover(() => btn.toggle('filter', '', 'brightness(0.9)'));
        btn.onclick = () => log(eval(cmd.value));
        panel.append(cmd, btn);
        createPopup(output, panel);
        return output;
    }

    function createPopup(...elements) {
        const container = $('div').css('position: fixed; z-index: 2147483647; left: 0; top: 0; background: #fff; opacity: 0.3; transition: width 0.5s, height 0.5s, opacity 5s 5s; overflow: hidden; box-shadow: 0 0 2em rgba(0, 0, 0, 0.3); color: #707070;').hover(() => {
            container.toggle('opacity', 0.3, 1);
            container.toggle('transition', 'width 0.5s, height 0.5s, opacity 0.3s', 'width 0.5s, height 0.5s, opacity 5s 5s');
        });
        const handle = $('div').css('padding: 0.25em; text-align: center; background: #eee; user-select: none; transition: 0.5s;').text('☰').hover(() => handle.toggle('filter', '', 'brightness(0.9)'));
        container.append(handle, ...elements);
        document.body.append(container);

        const h = handle.offsetHeight;
        container.css('width', h, 'height', h, 'border-radius', h / 2, x => x + 'px');

        let downCoord, moved;

        handle.onmousedown = e => downCoord = { ox: container.offsetLeft - e.clientX, oy: container.offsetTop - e.clientY };
        addEventListener('mousemove', e => {
            if (downCoord && e.buttons) {
                assign(container.style, { left: e.clientX + downCoord.ox + 'px', top: e.clientY + downCoord.oy + 'px' });
                moved = true;
            }
        });
        addEventListener('mouseup', e => {
            if (downCoord) {
                if (!moved) {
                    if (!container.ontransitionend) {
                        delay2Frame(() => {
                            container.ontransitionend = () => assign(container.style, { width: '', height: '' });
                            assign(container.style, container, { width: 'scrollWidth', height: 'scrollHeight' }, x => x + 'px');
                        });
                    } else {
                        container.ontransitionend = null;
                        container.style.width || assign(container.style, container, { width: 'scrollWidth', height: 'scrollHeight' }, x => x + 'px');
                        delay2Frame(() => {
                            container.ontransitionend = null;
                            assign(container.style, handle, { width: 'offsetHeight', height: 'offsetHeight' }, x => x + 'px');
                        });
                    }
                }
                downCoord = null;
                moved = false;
            }
        });
    }

    function delay2Frame(fn) {
        requestAnimationFrame(() => requestAnimationFrame(fn));
    }

    function log(msg, end = '\n') {
        const oldH = output.scrollHeight;
        !output.value || output.value.endsWith(end) || (output.value += end);
        output.value += msg + end;
        output.scrollBy(0, output.scrollHeight - oldH);
    }

    function assign(tgt, src, ...k) {
        if (!k.length) {
            Object.assign(tgt, src);
        } else {
            const fn = k[k.length - 1] instanceof Function ? k.pop() : x => x;
            if (!k.length) {
                Object.entries(src).forEach(([k, v]) => tgt[k] = fn(v));
            } else if (k[0] instanceof Object) {
                Object.entries(k[0]).forEach(([k, v]) => tgt[k] = fn(src[v]));
            } else {
                k.forEach(k => tgt[k] = fn(src[k]));
            }
        }
        return tgt;
    }

    function $(tag) {
        return document.createElement(tag).css('all: revert;'); // 重置为浏览器默认样式
    }

    function addMethods() {
        assign(HTMLElement.prototype, {
            hover(enterFn, leaveFn) {
                this.onmouseenter = enterFn;
                this.onmouseleave = leaveFn || enterFn;
                return this;
            },
            toggle(k = 'display', v1 = 'none', v2 = 'block', important = false) {
                this._style || (this._style = {});
                const v = (this._style[k] || this.style.getPropertyValue(k)) == v1 ? v2 : v1;
                this._style[k] = v;
                this.style.setProperty(k, v, important ? 'important' : undefined);
                return this;
            },
            css(css, ...args) {
                if (args.length == 0) {
                    this.style.cssText += css;
                } else {
                    const fn = args[args.length - 1] instanceof Function ? args.pop() : x => x;
                    if (css instanceof Object) {
                        Object.entries(css).forEach(([k, v]) => this.style.setProperty(k, fn(v)));
                    } else {
                        args.unshift(css);
                        for (let i = 0; i < args.length; i += 2)
                            this.style.setProperty(args[i], fn(args[i + 1]));
                    }
                }
                return this;
            },
            text(text) {
                this.innerText = text;
                return this;
            },
            val(val) {
                this.value = val;
                return this;
            }
        });
    }

    function request(details) {
        return GM_xmlhttpRequest(details || {
            method: 'GET',
            url: 'http://baidu.com',
            headers: {},
            data: '',
            timeout: 3000,
            onload(xhr) {
                log(html(xhr).title);
            },
            onerror() {
                log('连接失败');
            },
            ontimeout() {
                log('连接超时');
            }
        });
    }

    function html(s) {
        return new DOMParser().parseFromString(s instanceof Object ? s.responseText : s || '', 'text/html');
    }
}