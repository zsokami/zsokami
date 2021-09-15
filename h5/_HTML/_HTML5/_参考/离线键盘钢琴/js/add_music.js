// JavaScript Document
//一系列的H5元素生成
/********************
	这个文件主要处理键盘谱，
	动态生成元素，这里就少做注释了



*********************/
function get_br(){			//data-name='hr'		这里是自定义属性，是为了JS方便区别和控制程序的处理
	return $("<br data-name='br'/><hr data-name='hr'/>");
}
function get_b(){
	return $("<b data-name='b' style='margin-left:7px; margin-right:7px;font-size:36px;'></b>");
}
function get_p(){
	return $("<p  align='center' data-name='p'></p>");
}
function get_musicName_div(){
	return $("<div class='calss_name'></div>");
}
function get_music_div(){
	return $("<div class='name_div'></div>");
}
function get_music_h1(){
	return $("<h1  align='center' class='name_h1' style='color: #000;'></h1>");
}
function get_input(){
	return $("<input type='text' class='addinput' data-name='input'/>");
}
function set_add_music() {			//		界面二次初始化，界面被隐藏的歌曲信息通过JS处理添加到指定区域，H	
//	var th2=Concurrent.Thread.create(function(){		//多线程运行JQ代码不稳定
	//	window.clearInterval(set_add_music_setInterval);
		set_text();			//开始初始化
//	});
	ready_by=true;	//JS代码执行完毕状
}
function set_text(){		//开始初始

	/**********************
		遍历网页中的歌曲信息，这些信息用户是看不到的，通过JS获取这些信息，动态的生成，添加到网页中去
		下面调用的方法就是添加歌曲的函数，一个是处理键盘谱的函数，一个是把处理好的谱添加到网页中去
	
	**********************/
	$(".dif_name").each(function(index, element) {
		$("#add_name").val($(this).text());
		$("#add_text").val($("#"+$(this).attr("id")+"_text").text());
		ubd_music();
		add_music();
	});
	dle_music();				//清空添加歌曲的信息，不然会一直循环播
}
function IsPC() {			//手机已电脑的判断			*******没有用到
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows",
                "iPad", "iPod"];
	if(userAgentInfo.indexOf("Android")>-1||userAgentInfo.indexOf("iPhone")>-1){
		return false;
	}else{
		return true;
	}
}
var set_pc_temi;
var set_pc_music_i=-1;
function set_pc() {			//
	set_pc_music_i++;
	var ii1=-1;
	var ii2=-1;
	$("#"+event_b_id+" b").each(function(index, element) {
		if(set_pc_music_i == index){
			var si=$(this).text();
			if(si.charCodeAt(0)>64 && si.charCodeAt(0)<92){
				ii2=index;
				aiimusic(si.charCodeAt(0));
				set_styl(si.charCodeAt(0));
			}
		}
		ii1=index;
	});
	if(ii1==ii2-1){
		set_pc_music_i=-1;
	}
}
var event_b_s=null;
var event_b_i=0;
var event_b_id="";
var event_b_window;
function set_event_kaishi(){
	event_b_i=0;
	scro_i_by=false;
	for(var i=0;i<event_b_s.length;i++){
		event_b_s[i].css("font-size","36px");
		event_b_s[i].css("color","#000");
	}
	$("#aii").animate({scrollTop:0},100);
//	$("#aii").animate({scrollTop:document.getElementById(event_b_s[event_b_i].parent().attr("id")).offsetTop-$("#aii").height()/2+100},100);
}
function set_event_b_id(id){
	event_b_id=id;
	event_b_i=0;
	set_event();
	set_event_kaishi();
}
function set_event(){
	event_b_s=null;
	event_b_i=0;
	event_b_s=new Array($("#"+event_b_id+" b").length);
	$("#"+event_b_id+" b").each(function(index, element) {
		event_b_s[index]=$(this);
	});
}
function Oncemore(i){			//回车键重新开始
	if(i==13){
		set_event_kaishi();
	}
}
var scro_i=300;
var scro_i_by=false;
function set_styl(i){
	if(i==event_b_s[event_b_i].text().charAt(0).charCodeAt(0)){
		if(scro_i_by){
			scro_i_by=false;
			event_b_s[event_b_i].css("color","#ff0");
		}else{
			event_b_s[event_b_i].css("color","#fff");
		}
	}else{
		event_b_s[event_b_i].css("color","#F02020");
		scro_i_by=true;
		return ;
	}
	while(event_b_s[event_b_i].next().text().charAt(0).charCodeAt(0)==32){
		if(event_b_i<event_b_s.length){
			event_b_i++;
		}
	}
	$("#aii").animate({scrollTop:document.getElementById(event_b_s[event_b_i].parent().attr("id")).offsetTop-$("#aii").height()/2+100},100);
	if(event_b_i<=event_b_s.length-3){
		event_b_s[event_b_i+1].css("font-size","80px");
		event_b_s[event_b_i+2].css("font-size","60px");
		event_b_s[event_b_i+3].css("font-size","40px");
		event_b_s[event_b_i].css("font-size","60px");
	}else if(event_b_i>event_b_s.length-3){
		if(event_b_i==event_b_s.length-1){
			event_b_s[event_b_i+1].css("font-size","80px");
			event_b_s[event_b_i+2].css("font-size","60px");
		}
		if(event_b_i==event_b_s.length){
			event_b_s[event_b_i+1].css("font-size","80px");
		}
	}
	while(event_b_s[event_b_i].next().text().charAt(0).charCodeAt(0)==32){
		if(event_b_i<event_b_s.length){
			event_b_i++;
		}
	}
	if(event_b_i>=2){
		event_b_s[event_b_i-1].css("font-size","40px");
		event_b_s[event_b_i-2].css("font-size","36px");
		
	}else if(event_b_i>=1){
		event_b_s[event_b_i-1].css("font-size","40px");
	}
	
	event_b_i++;
}
function add_music(){				//添加歌曲
	if($(".addinput").length<3){
		return ;
	}
	var text_name=$("#add_name").val();
	if(text_name.length<1){
		alert("请输入歌曲名。。。");
		return ;
	}
	
	text_name="《"+text_name+"》";
	var add_div=get_musicName_div();
	var add_id="add_muisc"+$(".calss_name").length;
	add_div.attr("id",add_id);
	add_div.text(text_name);
	$("#add_musicname").prepend(add_div);
	
	var add_music_div=get_music_div(); //style="display:none" class="name_div"
	add_music_div.css("display","none");
	add_music_div.addClass("name_div");
	var add_div_id=add_id+"_div";
	add_music_div.attr("id",add_div_id);
	$("#aii").append(add_music_div);
	
	var name_h1=get_music_h1();
	name_h1.text(text_name);
	add_music_div.append(name_h1);
	var add_p=get_p();
	var add_p_id=add_div_id+"_p"+$("#"+add_div_id+" p").length;
	add_p.attr("id",add_p_id);
	$("#"+add_div_id).append(add_p);
	$(".addinput").each(function(index, element) {
		var add_b=get_b();
		add_b.attr("id","addinput_"+index);
		add_b.text($(this).val());
		$("#"+add_p_id).append(add_b);
		
		if($(this).next().attr("data-name") == "br"){
			add_p=get_p();
			add_p_id=add_div_id+"_p"+$("#"+add_div_id+" p").length;
			add_p.attr("id",add_p_id);
			$("#"+add_div_id).append(add_p);
		}
	});
	dle_music();				//清空添加歌曲的信息，不然会一直循环播
	set_calss_name_click();
}
function dle_music(){				//清空添加歌曲的信息，不然会一直循环播放音乐
	$("#add_name").val("");
	$("#add_text").val("");
	$("#add_div b").each(function(index, element) {
		$(this).remove();
	});
	$("#add_div br").each(function(index, element) {
		$(this).remove();
	});
	$("#add_div input").each(function(index, element) {
		$(this).remove();
	});
	$("#add_div hr").each(function(index, element) {
		$(this).remove();
	});
}
var true_music_temi;
function set_true_music(){				//断句播放音乐
//	true_music_i=-1;
	window.clearInterval(true_music_temi);
	true_music_temi=window.setInterval("true_music()",400);
}
var true_music_i=0;
function true_music(){				//断句播放音乐
	true_music_i++;
	if(true_music_i >= $(".addinput").length){
		true_music_i=0;
		window.clearInterval(true_music_temi);
		true_music_temi=window.setInterval("true_music()",400);
	}
	$(".addinput").each(function(index, element) {
		if(true_music_i == index){
			var si=$(this).val();
			$(this).css("background","#000");
			$(this).css("color","#fff");
			if(si.charCodeAt(0)>64 && si.charCodeAt(0)<92){
				aiimusic(si.charCodeAt(0));
			}else{
				window.clearInterval(true_music_temi);
				true_music_temi=window.setInterval("true_music()",400);
			}
		}else{
			$(this).css("background","#fff");
			$(this).css("color","#000");
		}
	});
}
function ubd_music(){				//纠正断句
	$("#add_div b").each(function(index, element) {
		$(this).remove();
	});
	$("#add_div br").each(function(index, element) {
		$(this).remove();
	});
	$("#add_div hr").each(function(index, element) {
		$(this).remove();
	});
	$("#add_div input").each(function(index, element) {
		$(this).remove();
	});
	var ss=$("#add_text").val();
	var sj="";
	var sk=ss.split("\n");
	for(var l=0;l<sk.length;l++){
		sx=sk[l];
		if(sx==""){
			continue;
		}
		for(var i=0;i<sx.length;i++){
			var si=sx.charAt(i);
			if(sj==si && (sj.charCodeAt(0)==32)){
				continue;
			}
			sj=si;
			var temp=get_input();
			temp.attr("size",1);
			temp.attr("id","temp_"+$(".addinput").length+i);
			temp.css("text-align","center");
			if(si.charCodeAt(0)>64 && si.charCodeAt(0)<92){
				temp.val(si);
				$("#add_div").append(temp);
			}else if(si.charCodeAt(0)>96 && si.charCodeAt(0)<123){
				temp.val(String.fromCharCode(si.charCodeAt(0)-32));
				$("#add_div").append(temp);
			}else if(si.charCodeAt(0)==32){   //空格
				temp.val(si);
				$("#add_div").append(temp);
			}
			if(i+1==sx.length){
				if(si.charCodeAt(0)!=32){
					var temp=get_input();
					temp.attr("size",1);
					temp.attr("id","temp_"+$(".addinput").length+i);
					temp.css("text-align","center");
					temp.val(String.fromCharCode(32));
					$("#add_div").append(temp);
				}
			}
		}
		if(l<sk.length-1){
			if($("#add_div:last").attr("data-name")!="hr"){
				var temp=get_br();
				$("#add_div").append(temp);
			}
		}
	}
	$(".addinput").each(function(index, element) {
		$(this).blur(function(){
			true_music_i=index-1;
			is_text($(this).attr("id"));
		});
	});
	window.setTimeout("set_true_music()",2000);
}
var tan_i=0;
function is_text(id){				//判断断句
	var id_b=id;
	var text=$("#"+id_b).val();
	if(text==null||text==""||text==" "){
		$("#"+id).remove();
		return ;
	}
	var t=0;
	for(var i=0;i<text.length;i++){
		if(text.charCodeAt(i)==32){
			t++;
		}
	}
	if(t==text.length){
		$("#"+id).remove();
		return ;
	}
	var sj=" ";
	var text_j="";
	if(text.charCodeAt(0)==32){
		if($("#"+id).prev().attr("data-name")!="hr"){
			var temp=get_br();
			$("#"+id_b).before(temp);
		}else{
			$("#"+id).prev().remove();
			$("#"+id).prev().remove();
		}
		for(var i=0;i<text.length;i++){
			if(sj==text.charAt(i) && sj.charCodeAt(0)==32){
				continue;
			}
			text_j+=text.charAt(i);
		}
		if(text_j==""||text_j==" "){
			text_j=text;
		}
	}else{
		text_j=text;
	}
	sj="?";
	for(var i=0;i<text_j.length;i++){
		var si=text_j.charAt(i);
		if(sj==si && si.charCodeAt(0)==32){
			continue;
		}
		sj=si;
		var temp=get_input();
		temp.attr("size",1);
		temp.attr("id",id_b+"_b_"+i);
		temp.css("text-align","center");
		if(si.charCodeAt(0)>64 && si.charCodeAt(0)<92){
			temp.val(si);
			$("#"+id_b).after(temp);
		}else if(si.charCodeAt(0)>96 && si.charCodeAt(0)<123){
			temp.val(String.fromCharCode(si.charCodeAt(0)-32));
			$("#"+id_b).after(temp);
		}else if(si.charCodeAt(0)==32){   //空格
			if($("#"+id_b).next().val()!=null){
				if(($("#"+id_b).next().val().charCodeAt(0)!=32) && ($("#"+id_b).prev().val().charCodeAt(0)!=32)){
					temp.val(si);
					$("#"+id_b).after(temp);
				}
			}else{
				temp.val(si);
				$("#"+id_b).after(temp);
			}
		}
		id_b=temp.attr("id");
	}
	$("#"+id).remove();
	$(".addinput").each(function(index, element) {
		$(this).blur(function(){
			true_music_i=index-1;
			is_text($(this).attr("id"));
		});
	});
}