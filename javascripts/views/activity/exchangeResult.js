define(['jumi','vue','asyncload','getPara'],function(jumi,vue,asyncload,getPara){


var para = getPara.get();
var invest_action_id = 627;
var paraCon = {
	invest_action_id:invest_action_id,
	phone:para.phone
}
	$.ajax({
		url:'/jingfang/projectinfo',
		type:'post',
		dataType:'json',
		data:paraCon,
		success:function(data){	
		// console.log(data);
	       new vue({
				el:'body',
				components:{
                    'my-itemname':{
                    	template:'#itemnameTemplate',
                    	data:function(){
                    		return{
                    			data:data
                    		}
                    	},
                    	methods:{
                    		// 重试
                    		exchangeAgain:function(){
								history.back();			
							},
							// 立即支持
							exchangeSupport:function(){               
								location.href = '/phone/detail/454.html';													
							},
							// 更多图文详情
							exchangeMore:function(){
                                location.href = '/phone/detail/454.html';	
							}
                    	}
                    },              
                },              
				ready:function(){
                   $('#myloading').remove();
				}								
		});	
	  }
	})

});