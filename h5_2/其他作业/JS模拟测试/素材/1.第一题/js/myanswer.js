$(() => {
	// 添加奇偶行样式（不含首尾）
	function setCss() {
		$('tr:gt(0):lt(-1):even').removeClass('even').addClass('odd');
		$('tr:gt(0):lt(-1):odd').removeClass('odd').addClass('even');
	}
	setCss();

	// 行点击切换选中效果
	$('table').on('click', 'tr:gt(0):lt(-1)', function(e) {
		$(this).toggleClass('selected');
		$(e.target).is(':checkbox') || $(this).find(':checkbox').prop('checked', (i, v) => !v);
	});

	// 图片预览效果
	$('table').on({
		'mouseenter mouseleave'() {
			$('#photo').stop().toggle(300).find('#big').attr('src', $(this).attr('src'));
		},
		'mousemove'(e) {
			$('#photo').css({
				left: e.pageX + 10 + 'px',
				top: e.pageY + 10 + 'px'
			});
		}
	}, '.td_image');
	
	const template = $('tr:eq(-2)').clone();

	// 绑定添加按钮事件
	$('[name=addOrder]').click(function() {
		$('tr:last').before(template.clone());
		setCss();
	});

	// 绑定删除按钮事件
	$('[name=delOrder]').click(function() {
		$('.selected').remove();
		setCss();
	});
});
