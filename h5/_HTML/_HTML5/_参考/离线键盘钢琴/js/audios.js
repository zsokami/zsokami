// JavaScript Document
var ready_by=false;		//JS代码执行完毕状态
function ready(){		//开始
//	var th2=Concurrent.Thread.create(function(){		//多线程运行JQ代码不稳定
		$(window).resize(function() {  				//窗口大小监听器
			set_resize();
		});
		set_resize();			//获取屏幕大小的参数
		setname();			//设置标题动态改变渐
		set_kaishi();			//布局
		set_music();			//初始化音乐的资源文件		
		$("#list li").each(function(index, element) {		//		为26个字母添加单击事件，播放音乐
			$(this).click(function(){
				aiimusic($(this).text().charCodeAt(0));					//播放音乐和更改样
			});
		});
	//	window.setTimeout(set_add_music(),500);			//		界面二次初始化，界面被隐藏的歌曲信息通过JS处理添加到指定区域，H5元素动态生成
		set_add_music();
	//	set_add_music_setInterval=window.setInterval(set_add_music(),500);
		
//	});
}
var set_add_music_setInterval;
function get_audio(){			//获取音乐元素
	return $("<audio></audio>");
}
// document.write()	;		//向文档写文本、HTML表达式或JavaScript代码

var musicfi_s=new Array(26);
var filr_pa="audios/";
var muoshi=0;
function set_music(){			//初始化音乐的资源文件		
	for (var i=0;i<26;i++){
		if(i<9){
			musicfi_s[i]=filr_pa+"0"+(i+1)+".mp3";
		}else{
			musicfi_s[i]=filr_pa+(i+1)+".mp3";
		}
		var audio=get_audio();			//获取音乐元素
		audio.attr("src",musicfi_s[i]);
		audio.attr("id","music_src_"+musicfi_s[i]);
		$("body:first").append(audio);
	}
	document.onkeydown=function(e){			//键盘监听器	
		if(e.keyCode>64&&e.keyCode<92){
			aiimusic(e.keyCode);					//播放音乐和更改样
			set_styl(e.keyCode);
		}else{
			Oncemore(e.keyCode);			//回车键重新开始游戏，函数在另一个文件
			upd_name(e.keyCode);			//键盘监听改变歌曲
		}
	}
}
var musicfi_s_i=65;
var music_src_str;
function aiimusic(i){					//播放音乐和更改样式
	musicfi_s_i=i;
	music_src_str="music_src_"+musicfi_s[i-65];
	document.getElementById(music_src_str).currentTime=0;
	document.getElementById(music_src_str).play();
	set_class(i-65);			//更改26个字母样式
}
function set_class(jj){				//更改26个字母样式
	$("#list li").each(function(index, element) {
		if(index==jj){
			$(this).addClass("active");
		}else{
			$(this).removeClass();
		}
	});
}
function set_calss_name_click(){			//歌曲名的单击事件和鼠标事件
	$(".calss_name").each(function(index, element) {
		$(this).unbind(); //移除所有 
		$(this).click(function(){
			set_click(index);		//单击获取歌曲名的id
		});
		$(this).mousemove(function(){
			$(this).css("border","solid 1px");
		});
		$(this).mouseout(function(){
			$(this).css("border","solid 0px");
		});
	});
	set_click(0);		//单击获取歌曲名的id		设置第一首歌曲
}
function set_kaishi(){			//布局
	$("#aii").height(heig-80);
	$("#add_musicname").height(heig-160);
	set_calss_name_click();			//歌曲名的单击事件和鼠标事件
	$(".calss_set").each(function(index, element) {
		$(this).click(function(){
			set_show_click($(this).attr("id"));		//	使用歌曲名的id得到相对应的div，然后显示出来，其它的div隐藏
		});
	});
}

function set_show_click(id){			//	使用歌曲名的id得到相对应的div，然后显示出来，其它的div隐藏
	$(".name_div").each(function(index, element) {
		var id1=$(this).attr("id");
		if(id1==$("#"+id+"_div").attr("id")){			//为了避免二次显示，使用放在遍历中
			set_event_b_id(id1);
			$("#"+id+"_div").show(500);
		}else{
			$(this).hide(500);
		}
	});
	if(ready_by){						//更改歌曲名区域的滚动条位置
		$("#add_musicname").animate({scrollTop:document.getElementById(upd_name_id).offsetTop-$("#add_musicname").height()/2-70},0);
	}
}
var upd_name_id="";

function upd_name(i){			//键盘监听改变歌曲
	if(i>=37 && i<=40){			//下一首或者上一首
		if(i==40){
			if($("#"+upd_name_id).next()!=null){
				$("#"+upd_name_id).next().click();			//歌曲名的单击事件改变div的显示已隐藏
			}
		}else if(i==38){
			if($("#"+upd_name_id).prev()!=null){
				$("#"+upd_name_id).prev().click();
			}
			
		}else if(i==37){
		//	aiimusic($(this).text().charCodeAt(0));	
			if(musicfi_s_i>64&&musicfi_s_i<92){
				if(musicfi_s_i==65){
					musicfi_s_i=90;
					aiimusic(musicfi_s_i);
				}else{
					musicfi_s_i--;
					aiimusic(musicfi_s_i);
				}
			}
		}else if(i==39){
			if(musicfi_s_i>64&&musicfi_s_i<92){
				if(musicfi_s_i == 90){
					musicfi_s_i=65;
					aiimusic(musicfi_s_i);
				}else{
					musicfi_s_i++;
					aiimusic(musicfi_s_i);
				}
			}
		}
	}
}
function set_click(i){			//单击获取歌曲名的id
	var id1;
	$(".calss_name").each(function(index, element) {
		var id=$(this).attr("id");
		if(index==i){
			id1=id;
			upd_name_id=id;
			//$(this).css("text-decoration","underline");			//添加下划线
			$(this).css("color","#0ff");
		}else{
			//$(this).css("text-decoration","none");
			$(this).css("color","#fff");
		}
	});
	set_show_click(id1);		//	使用歌曲名的id得到相对应的div，然后显示出来，其它的div隐藏
}
var widt;
var heig;

function set_resize(){			//	控制窗口大小被改变时调用
	widt=window.innerWidth;
	heig=window.innerHeight-50;
	if(heig==null || widt==null){
		if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
			 heig = document.documentElement.clientHeight;
			 widt = document.documentElement.clientWidth;
		}
	}
	set_kaishi();			//布局
}
var name_color=new Array(20);		//设置标题动态改变渐
function setname(){		//设置标题动态改变渐
	for(var i=0;i < name_color.length;i++){
		name_color[i]=getolor();
	}
//	window.setInterval("set_name()",150);		//设置标题 随机 变渐
	window.setInterval("set_name2()",150);		//设置标题 随机 并且 会跑动的 变渐
}
function set_name(){		//设置标题 随机 变渐
	var th2=Concurrent.Thread.create(function(){		//Concurrent.Thread.create 这个地方是多线程框架
	
		var color="";
		for(var i=0;i< name_color.length-1;i++){
			color=color+","+name_color[i];
			name_color[i]=getolor();
		}
		$("#name").css("background","-webkit-linear-gradient(180deg"+color+")");	//180deg 角度
		
		//如果只需要背景渐变，下面两行把它注释了
		$("#name").css("-webkit-background-clip","text");					//这个地方是人背景颜色变到字体上去
		$("#name").css("-webkit-text-fill-color","transparent");			//这个地方是人背景颜色变到字体上去
	});
}
function set_name2(){		//设置标题 会跑动的 变渐
	var th2=Concurrent.Thread.create(function(){
		var color2="";
		for(var i=0;i< name_color.length-1;i++){
			name_color[i]=name_color[i+1];
			color2=color2+","+name_color[i];
		}
		$("#name").css("background","-webkit-linear-gradient(180deg"+color2+")");
		
		//如果只需要背景渐变，下面两行把它注释了
		$("#name").css("-webkit-background-clip","text");					//这个地方是人背景颜色变到字体上去
		$("#name").css("-webkit-text-fill-color","transparent");			//这个地方是人背景颜色变到字体
		
		
		name_color[name_color.length-1]=getolor();
	});
}
function getolor(){ //随机获取颜色
	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); 
}