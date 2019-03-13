define(['jquery','vue'],function($,vue){
	$.ajax({
		url:'/admin/item/getRank',
		type:'post',
		dataType:'json',
		success:function(data){
			new vue({
				el:'body',
				components:{
					'my-christmasandneujahr':{
						template:'#christmasAndNeujahrTemplate',
						data:function(){
							return {
								data:data
							}
						}
					}
				},
				ready:function(){
					$('#myloading').remove();
				}
			});
		}
	});
});
