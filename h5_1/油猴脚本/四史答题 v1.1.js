// ==UserScript==
// @name         四史答题
// @version      1.1
// @description  中国大学生在线，“网上重走长征路”四史竞答活动，自动答题刷分
// @author       Mannix Zhong
// @match        ssxx.univs.cn/*
// @connect      zsokmi.wodemo.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(() => {
    const setting = {
        DEBUG: 0, // 调试等级 0 1 2
        AUTO_START: 0, // 是否自动开始
        AUTO_VCODE: 1, // 是否自动填写验证码
        ENABLED: 1, // 是否启用
        DELAY: 1500, // 答题延迟时间
        TYPE: '抢十赛' // 指定篇章或比赛，可以多个，如'限时赛 抢十赛'，可以为空（默认全部）
    };

    setting.ENABLED = setting.ENABLED && !setting.DEBUG;

    const TYPES = {
        英雄篇: 'pt1',
        复兴篇: 'pt2',
        创新篇: 'pt3',
        信念篇: 'pt4',
        限时赛: 'xianshi',
        抢十赛: 'qiangshi'
    };

    addMethods();

    setting.DEBUG || createController();
    const output = setting.DEBUG ? createConsole() : null;

    const answer_correct = new Set();

    let timer;
    let preCorrect;

    fetch_answer_correct(ac => {
        ac.match(/.{24}/g).forEach(answer_correct.add, answer_correct);
        log('当前题库大小：' + answer_correct.size);
        if (answer_correct.size != ac.length / 24) {
            log('题库异常：' + (ac.length / 24));
        }
        setting.DEBUG || run();
    });

    function run() {
        if (!setting.ENABLED) {
            clearTimeout(timer);
            timer = null;
            return;
        }
        if (location.pathname.startsWith('/client/exam')) {
            let vcode, vcodeInput;
            if ((vcode = document.querySelector('.code_span')) && vcode.offsetHeight) {
                if (setting.AUTO_VCODE && !(vcodeInput = document.querySelector('.el-input__inner')).value) {
                    vcodeInput.focus();
                    delay(() => {
                        delayInput(vcode.innerText.toLowerCase(), () => delay(() => {
                            document.querySelector('.common_btn2').click();
                            delay(run, 0.3);
                        }, 0.3));
                    }, 0.5);
                } else {
                    delay(run, 0.3);
                }
            } else {
                const radios = [...document.querySelectorAll('.el-radio')];
                const checkboxes = [...document.querySelectorAll('.el-checkbox')];
                const radios_and_checkboxes = [...radios, ...checkboxes];
                if (!radios_and_checkboxes.length) {
                    delay(run, 0.3);
                } else if (!radios_and_checkboxes.some(i => i.classList.contains('is-checked'))) {
                    if (preCorrect) {
                        preCorrect.forEach(add_answer_correct);
                        preCorrect = null;
                    }
                    delay(() => {
                        const corrected = radios_and_checkboxes.filter(i => answer_correct.has(id(i)));
                        let clickable;
                        if (corrected.length) {
                            clickable = corrected;
                        } else {
                            clickable = [...rndSingleton(radios), ...checkboxes];
                            preCorrect = clickable.map(id);
                        }
                        delayClick(clickable, () => delay(() => {
                            document.querySelectorAll('.question_btn').forEach(btn => btn.style.display == 'none' || btn.click());
                            delay(run, 0.3);
                        }, 0.2));
                    }, 0.5);
                } else {
                    const ac = radios_and_checkboxes.filter(i => i.classList.contains('answer_correct'));
                    if (ac.length) {
                        ac.map(id).forEach(add_answer_correct);
                        preCorrect = null;
                    }
                    delay(run);
                }
            }
        } else if (setting.AUTO_START) {
            delay(() => {
                if (location.pathname.startsWith('/client/result')) {
                    if (preCorrect) {
                        preCorrect.forEach(add_answer_correct);
                        preCorrect = null;
                    }
                    const result_back_btn = document.querySelector('.result_back_btn');
                    result_back_btn && result_back_btn.click();
                } else if (location.pathname.startsWith('/client/detail')) {
                    const img = document.querySelector(`[src="/public/pc3/${TYPES[rndGet(setting.TYPE.match(/[\w\u0100-\uffff]{3}/g))] || rndGet(Object.values(TYPES))}.png"]`);
                    img && img.click();
                }
                delay(run, 0.3);
            }, 2);
        } else {
            delay(run, 0.3);
        }
    }

    function delay(fn, rate = 1) {
        timer = setTimeout(fn, setting.DELAY * rate * (0.5 + Math.random()));
    }

    function delayInput(text, fn, i = 0) {
        if (i < text.length) {
            document.execCommand('insertText', false, text[i]);
            if (i + 1 < text.length) {
                delay(() => delayInput(text, fn, i + 1), 1 / text.length);
                return;
            }
        }
        fn();
    }

    function delayClick(clickable, fn, i = 0) {
        if (i < clickable.length) {
            clickable[i].click();
            if (i + 1 < clickable.length) {
                delay(() => delayClick(clickable, fn, i + 1), 0.5 / clickable.length);
                return;
            }
        }
        fn();
    }

    function rndSingleton(a) {
        return a.length ? [rndGet(a)] : [];
    }

    function rndGet(a) {
        return a[Math.random() * a.length | 0];
    }

    function log(msg, end = '\n', level = 2) {
        if (setting.DEBUG < level) return;
        const oldH = output.scrollHeight;
        !output.value || output.value.endsWith(end) || (output.value += end);
        output.value += msg + end;
        output.scrollBy(0, output.scrollHeight - oldH);
    }

    function id(i) {
        return i.querySelector('input').value;
    }

    function add_answer_correct(id) {
        if (!answer_correct.has(id)) {
            answer_correct.add(id);
            log(id, '', 1);
        }
    }

    function createConsole() {
        const output = $('textarea').css('display: block; min-width: 300px; min-height: 300px; border: 1px grey; border-style: solid none; outline: none; color: inherit;');
        const panel = $('div').css('display: flex;');
        const cmd = $('textarea').css('resize: none; flex: 1; border: none; outline: none; color: inherit;').val(`setting.TYPE='${setting.TYPE}';\nsetting.AUTO_START=${setting.AUTO_START};\nsetting.DELAY=${setting.DELAY};\n(setting.ENABLED^=1)&&run();\nsetting.ENABLED?'开始':'停止';`);
        const btn = $('div').css('padding: 0.5em 1em; text-align: center; line-height: 5em; background: #eee; user-select: none; transition: 0.5s;').text('run').hover(() => btn.toggle('filter', '', 'brightness(0.9)'));
        btn.onclick = () => log(eval(cmd.value));
        panel.append(cmd, btn);
        createPopup(output, panel);
        return output;
    }

    function createController() {
        function b(text) {
            const btn = $('div').css('margin: 0.25em; padding: 0.5em 1em; border-radius: 2em; text-align: center; user-select: none; transition: 0.5s;').text(text).hover(() => btn.checked || btn.toggle('background', '#eee', ''));
            btn.addEventListener('click', () => ((btn.checked ^= 1), btn.toggle('background', '#eee', '#09f'), btn.toggle('color', '#fff', '')));
            return btn;
        }

        function t(text) {
            return $('div').css('padding: 0.25em 0; color: #bbb;').text(text);
        }

        const controller = $('div').css('padding: 0.25em; display: grid; grid-template-columns: auto auto; width: max-content;');
        const typeBtns = Object.keys(TYPES).map(b);
        typeBtns.forEach(btn => btn.addEventListener('click', null));
        const speedText = t('秒/题').css('text-align: right;');
        const speedSpan = $('span');
        speedText.prepend(speedSpan);
        const speedInput = assign($('input').css('grid-column: span 2;'), { type: 'range', min: 1, max: 500 });
        const startBtn = b('未启用').css('grid-column: span 2;');
        startBtn.addEventListener('click', null);
        controller.append(t('自动开始项').css('grid-column: span 2;'), ...typeBtns, t('速度'), speedText, speedInput, startBtn);
        createPopup(controller);
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

    function fetch_answer_correct(fn, retryCount = 0, msg = '获取题库...') {
        if (retryCount > 10) {
            log('获取失败！');
            return;
        }
        log(msg + (retryCount || ''));
        GM_xmlhttpRequest({
            url: 'https://zsokmi.wodemo.com/answer_correct',
            timeout: 5000,
            onload(xhr) {
                if (xhr.status == 200) {
                    fn(html(xhr).querySelector('.wo-text-text').innerHTML);
                } else {
                    fetch_answer_correct(fn, retryCount + 1, `${xhr.status}错误（${xhr.statusText}），正在重试...`);
                }
            },
            onerror() {
                fetch_answer_correct(fn, retryCount + 1, `连接失败，正在重试...`);
            },
            ontimeout() {
                fetch_answer_correct(fn, retryCount + 1, '连接超时，正在重试...');
            }
        });
    }

    function html(s) {
        return new DOMParser().parseFromString(s instanceof Object ? s.responseText : s || '', 'text/html');
    }
})();