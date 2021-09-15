$(() => {
	let cur;
	let timer;

	function move(i) {
		if (i == cur) return;
		if (isNaN(i)) i = (cur + 1) % $('#number>*').length;
		$('#show').stop().animate({ left: `-${i}00%` }, 300);
		$('#number>*').eq(cur).removeClass('on');
		$('#number>*').eq(i).addClass('on');
		cur = i;
	}

	$('#number>*').css('cursor', 'default').click(function() {
		move($(this).index());
	});

	$('#slider').hover(function() {
		clearInterval(timer);
	}, function() {
		timer = setInterval(move, 3000);
	}).mouseleave();

	move(0);
});
