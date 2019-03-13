/*  
* @description: 下拉框三级联动
* @author: adhehe
* @update: null
*/
define(function(require,exports,module){
	var jQuery = require("jquery");
	var jumi = require("jumi");
	
	$.fn.selectlinkage = function(options){
		var opts = $.extend({},$.fn.selectlinkage.defaults,options);
		
		return this.each(function(){
			var $this = $(this);
			var level = opts.level;
			var str = '';
				
			$this.on('click',function(){
				 str = '';
				//获取数据
				$.getJSON(opts.url, function(data) {
					if(opts.level == 2){
						str += ''
							+'<div class="selectlinkage">'
							+'	<div class="selectlinkage-item">'
							+'		<dl>'
							
						for(m in data){
							for(n in data[m]){
								str += '<dd>'+ data[m][n]["name"] +'</dd>';
							}
						}	
						
						str += ''	
							+'		</dl>'
							+'	</div>'
							+'	<div class="selectlinkage-item">'
							+'		<dl>'
						
						/*for(m in data){
							for(n in data[m]){
								var name = data[m][n]["name"];
								if(name == '北京'){
									for(k in data[m][n]["cities"]['city']){
										str += '<dd>'+ data[m][n]["cities"]['city'][k] +'</dd>';
									}
								}
							}
						}*/
						
						str += ''
							+'		</dl>'
							+'	</div>'
							+'</div>';
					}
					
					//弹出窗口
					jumi.alert({
						title:opts.title,
						content:str,
						button:[{
							value:'确认',
							callback:function(){
								str = "";
								$(this).blur();
								var len = $(".selectlinkage").find('.active').length;
								if(len == 0){
									$this.val("");
									return true;
								}
								if(len == 1){
									jumi.tips('请选择');
									return false;
								}
								
								var level1 = $(".selectlinkage").find('.active:first').html();
								var level2 = $(".selectlinkage").find('.active:last').html();
								$this.html(level1 + " " + level2);
							}
						},{
							value:'取消',
							callback:function(){
								str = "";
							}
						}]
					});
					
					$('.selectlinkage .selectlinkage-item:first dl dd').on('click',function(){
						$(this).siblings().removeClass('active');
						$(this).addClass('active');
						var province = $(this).html();
						var city = '';
						
						for(m in data){
							for(n in data[m]){
								var name = data[m][n]["name"];
								if(name == province){
									for(k in data[m][n]["cities"]['city']){
										city += '<dd>'+ data[m][n]["cities"]['city'][k] +'</dd>';
									}
								}
							}
						}
						
						$('.selectlinkage .selectlinkage-item:last dl').html(city);
					});
					
					$('.selectlinkage .selectlinkage-item:last dl').on('click','dd',function(){
						$(this).siblings().removeClass('active');
						$(this).addClass('active');
					});
				});
				
			});
		});
	}
	$.fn.selectlinkage.defaults = {
			level:2,
			url:null,
			title:null
	}
});





