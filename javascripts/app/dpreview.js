/*  
* @description: dpreview 设备类型及字号自适应
* @author: adhehe
* @update: null
*/

define(['jquery'],function($){
	//判断访问页面的设备类型
	var dpreview = function () {
	    var sUserAgent = navigator.userAgent.toLowerCase();  
	    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
	  		  bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
			  bIsMidp = sUserAgent.match(/midp/i) == "midp",
			  bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
			  bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
			  bIsAndroid = sUserAgent.match(/android/i) == "android",
			  bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
			  bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";  
	
	    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
				return 2; //非PC
	    } else {
	    	//PC端显示移动端内容时，不可操作
	    	//考虑到PC端微信网页版，暂时注释
//	    		$('body').on('click',function(e){
//	    			e.preventDefault();
//	    			e.stopPropagation();
//	    			return false;
//	    		});
				return 1; //PC
	    }
	}
	//根据宽度变化字号
	var fontsize = function (fontsize){
		var width = window.innerWidth;
		fontsize = (fontsize == undefined) ? ( (width < 640) ? ((28 * width) / 640) : 28) : 14; //算法
		$("html").attr("data-dpr",dpreview()); //设备类型
		$("html").css("font-size",fontsize); //基本字号
	}
	
	$(function(){
		fontsize();
		$("#j-loading").hide();
		$(window).resize(function(){
			fontsize();
		})
	});

});