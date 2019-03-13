/*  
* @description: 滚动到顶部
* @author: adhehe
* @update: null
*/
define(['jquery'],function($){
	var o = {
			htmlStr:'<div class="scrollToTop" id="scrollToTop">▲<br><span style="font-size:1rem;">TOP</span></div>',
			init:function(){
				this.add();
				if($(document.body).scrollTop() > 500){
					$('#scrollToTop').show();
				}else{
					$('#scrollToTop').hide();
				}
				this.toScroll();
			},
			add:function(){
				$(this.htmlStr).appendTo($(document.body)).hide();
				$('#scrollToTop').bind('click',function(){
					$(document.body).scrollTop(0);
				});
			},
			toScroll:function(){
				$(window).scroll(function(){
					var bodyScrollTop = $(document.body).scrollTop();
					if(bodyScrollTop > 500){
						$('#scrollToTop').show();
					}else{
						$('#scrollToTop').hide();
					}
				});
			}
	}
	return o.init();
});





