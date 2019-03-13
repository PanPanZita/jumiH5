/*  
* @description: 背景全屏
* @author: adhehe
* @update: null
*/
define(['jquery','jumi'],function($,jumi){
	var o = {
			setHeight:function(){
				if(localStorage.fromapp == 'ios'){
					//app的body高度需要减去head高度
					$('body').css('height',window.innerHeight + localStorage.navHeight/2);
				}else if(localStorage.fromapp == 'android') {
					$('body').css('height',window.innerHeight + localStorage.navHeight/2);
				}else{
					var height = window.innerHeight > document.body.scrollHeight ? window.innerHeight : document.body.scrollHeight;
					$('body').css('height',height);
				}
			},
			resize:function(){
				var that = this;
				$(window).resize(function(){
					that.setHeight();
				});
			}
	}
	
	o.setHeight();
	o.resize();
	
	return o;
});




