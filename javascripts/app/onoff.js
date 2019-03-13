/*  
* @description: onoff 开关按钮
* @author: adhehe
* @update: null
*/
define(['jquery'],function($){
	/* 开关按钮 */
	(function($){
		$.onoff = function(options){
			$('[data-onoff]').each(function(){
				var ison = $(this).data("onoff");
				if(ison == "on"){
					$(this).addClass('active').find(".onoff-handle").css({"right":"-1.15em","left":"auto"});
//					$(this).find('.onoff-info').html('ABC').css("text-align","left");
				}else if(ison == "off"){
					$(this).removeClass('active').find(".onoff-handle").css({"right":"auto","left":"-1.15em"});
//					$(this).find('.onoff-info').html('●●●').css("text-align","right");
				}
			})
		}
		
		$.fn.onoff = function(options){
			var opts = $.extend({},$.fn.onoff.defaults,options);
			return this.each(function(){
				$(this).on("click",function(){
					var isoff = $(this).data("onoff");
					if(isoff == "off"){
						$(this).addClass('active').find(".onoff-handle").css({"right":"-1.15em","left":"auto"});
//						$(this).find('.onoff-info').html('ABC').css("text-align","left");
						$(this).data("onoff","on");
						opts["on"]();
					}else if(isoff == "on"){
						$(this).removeClass('active').find(".onoff-handle").css({"right":"auto","left":"-1.15em"});
//						$(this).find('.onoff-info').html('●●●').css("text-align","right");
						$(this).data("onoff","off");
						opts["off"]();
					}
				})
			});
			$.fn.onoff.defaults = {
				on:null,
				off:null
			}
		}
	})(jQuery);

	$(function(){
		$.onoff();//初始化页面时，判断默认开关
	});

});

