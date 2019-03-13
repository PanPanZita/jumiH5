/*  
* @description: limit 字数限制
* @author: adhehe
* @update: null
*/
define(['jquery'],function($){
	var limit = function(options){
		var defaults = {
			dom:null,
			numDom:null,
			max:null
		}
		var opts = $.extend({},defaults,options);
		var $dom = $(opts.dom);
		var $numDom = $(opts.numDom);
		var max = opts.max;
		var num = 0;
		
		if(!$dom.length) return;

		$(document).on('keyup',opts.dom,function(){
			var str = $(this).val();
			var len = str.length;
			calculate(max,len,str);
		});
		
		//文本框显示与计算
		function calculate(max,len,str){
			if(len > max){
				var newStr = str.substring(0,max);
				$dom.val(newStr);
			}else{
				num = max - len;
				if(num <= 0){
					num = 0;
				}
				$numDom.html(num);
			}
		}
		
		
			
		//输入复制黏贴
		if($.browser.msie) {
			$dom.get(0).onpropertychange = validateInput;
		}else{
			$dom.get(0).addEventListener("input",validateInput,false); 
		}
		 
		function validateInput(){
			var str = $dom.val();
			var len = str.length;
			calculate(max,len,str);
		}
		//end
	}

	return window.limit = limit;
});





