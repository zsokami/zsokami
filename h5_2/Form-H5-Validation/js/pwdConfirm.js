if (pwd && pwdConfirm) {
	pwd.onchange = () => pwdConfirm.pattern = pwd.value;
}