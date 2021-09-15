// 字符串验证器
const validators = {
	username() {
		if (this.length < 4 || this.length > 16)
			return false;
		for (const c of this)
			if (!isNaN(c))
				return false;
		return true;
	},
	pwd() {
		return this.length >= 4 && this.length <= 10;
	},
	pwdConfirm() {
		return this == pwd.value;
	},
	email() {
		const apos = this.indexOf('@');
		return apos >= 1 &&
			this.indexOf('@', apos + 1) < 0 &&
			this.indexOf('.', apos + 1) >= apos + 2 &&
			!this.endsWith('.') &&
			this.indexOf('..', apos + 2) < 0;
	},
	tel() {
		return this.length == 11 && this.startsWith('1');
	},
	vcode() {
		return checkVCode(this);
	}
};
// 升级为表单验证器
for (const id in validators) {
	const fn = validators[id];
	const span = document.querySelector(`form>span[for=${id}]`);
	this[id].addEventListener('input', validators[id] = function() {
		if (this.value) {
			if (fn.call(this.value)) {
				this.style = '';
				span.style.backgroundImage = 'url(img/ok.png)';
				span.innerHTML = '';
				return true;
			} else {
				this.style.borderColor = '#FF8080';
				span.style.backgroundImage = 'url(img/error.png)';
				span.innerHTML = span.getAttribute('content');
			}
		} else {
			this.style = '';
			span.style = '';
			span.innerHTML = '';
		}
		return false;
	});
	this[id].onanimationend = function() {
		this.style.animation = '';
	};
}
// 修改密码时重新检查确认密码
pwd.addEventListener('input', () => validators.pwdConfirm.call(pwdConfirm));
// 更换验证码时重新检查验证码
vimg.addEventListener('click', () => validators.vcode.call(vcode));
// 提交时验证全部
document.forms[0].onsubmit = function() {
	for (const id in validators) {
		const input = this[id];
		if (!validators[id].call(input)) {
			input.focus();
			input.style.animation = 'warn 0.05s alternate 2';
			return false;
		}
	}
	return true;
};