/*  
* @description: tab 滑动门切换
* @author: adhehe
* @update: null
*/

define(['jquery'],function($){
	$(document).on("click","[data-toggle='tab']",function(){
		var src = $(this).attr("href");
		
		//导航样式
		$(this).parent().addClass("active").siblings().removeClass("active");
		
		//内容样式
		$(src).addClass("active").siblings().removeClass("active");
		
		
		return false;
	});
});