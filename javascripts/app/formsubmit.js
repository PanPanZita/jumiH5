/*  
* @description: form-submit 表单提交按钮监听
* @author: adhehe
* @update: 2014-04-1
*/

define(['jquery'],function($){
	(function($){
		$.fn.formsubmit=function(options){
			var opts=$.extend({},$.fn.formsubmit.defaults,options);
			
			var thiz=$(this);
			var formControls = thiz.find("[data-form-control]");
			var submit = thiz.find("[data-form-submit]");
			
			//扩展
			var formControls_extend = thiz.find("[data-form-control-extend]");
			var button_extend = thiz.find("[data-form-button-extend]");
			
			return this.each(function(){
				//init
				function init(){
					var len = formControls.length,len2 = 0;
					formControls.each(function(index,element){
						if($(this).attr("type") == "checkbox"){//checkbox
							if($(this).prop("checked")){
								len2++;
							}
						}else{//others
							if($(this).val() != ""){
								len2++;
							}
						}
					});
					if(len == len2){
						submit.removeClass("disabled");
					}else{
						submit.addClass("disabled");
					}
				}
				
				//初始化
				init();
				
				//input click
				formControls.on("keyup click",function(){
					init();
				});
				
				
				//扩展
				function init2(){
					var len = formControls_extend.length,len2 = 0;
					formControls_extend.each(function(index,element){
						if($(this).attr("type") == "checkbox"){//checkbox
							if($(this).prop("checked")){
								len2++;
							}
						}else{//others
							if($(this).val() != ""){
								len2++;
							}
						}
					});
					if(len == len2){
						button_extend.removeClass("disabled");
					}else{
						button_extend.addClass("disabled");
					}
				}
				
				//初始化
				init2();
				
				//input click
				formControls_extend.on("keyup click",function(){
					init2();
				});
				
				
			});// end return this.each()
		};// end $.fn.formsubmit
		
		$.fn.formsubmit.defaults={};
	})(jQuery);
	
	$(function(){
		$("[data-form]").each(function(index, element) {
			$(this).formsubmit();
	    });
	});

});