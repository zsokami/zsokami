$(function() {
	let cur;
	let timer;

	function move(i) {
		if (i == cur) return;
		if (isNaN(i)) i = (cur + 1) % $('.aui-banner-circle>ul>*').length;
		$('#show').stop().animate({ left: -i + '00%' }, 300);
		$('.aui-banner-circle>ul>*').eq(cur).removeClass('on');
		$('.aui-banner-circle>ul>*').eq(i).addClass('on');
		cur = i;
	}

	$('.aui-banner-circle>ul>*').css('cursor', 'default').mouseenter(function() {
		move($(this).index());
	});

	$('#slider').hover(function() {
		clearInterval(timer);
	}, function() {
		timer = setInterval(move, 2000);
	}).mouseleave();

	move(0);
});
