define(['jumi','vue','asyncload','getPara'],function(jumi,vue,asyncload,getPara){


var shopName = getPara.get();
var shop_name = decodeURI(shopName.shop_name);
var invest_action_id = 627;
	$.ajax({
		url:'/jingfang/projecthome',
		type:'post',
		dataType:'json',
		data:{invest_action_id:invest_action_id},
		success:function(data){
	       new vue({
				el:'body',
				components:{
                    'my-itemname':{
                    	template:'#itemnameTemplate',
                    	data:function(){
                    		return{
                    			data:data
                    		}
                    	}
                    },    
                    'my-phone':{
                    	template:'#phoneTemplate',
                    	data:function(){
                    		return{
                    			phone:''
                    		}
                    	},
                    	methods:{
                    		inputPhoneKeyup:function(){
								var patrn_length = /^\S{11}$/;	
								var patrn_number = /^[0-9]*$/;				//纯数字
								if(!patrn_length.test(this.phone)){
									this.phone = this.phone.substring(0,11);
								}		
								if(!patrn_number.test(this.phone)){
									jumi.tips('请输入正确的手机号！');
									return;
								}						
							},
							exchangeRight:function(){               
								var para = {
									invest_action_id:invest_action_id,
									phone:this.phone
								};	
								var paraNext = {
									invest_action_id:invest_action_id,
									phone:this.phone,
									shop_name:shop_name
								};		
							    $.ajax({
									url     : "/jingfang/willconvert",
									type    : 'post',
									cache   : false,
									dataType: 'json',
									data    : para,
									success: function(data){
										// console.log(data);												
										if(data.result){
										    if(data.status == 0){
										    	jumi.alert({
										    		skin:'ui-dialog-bankcard',
												   	title:'提示',
												   	content:'是否确认兑换',
												   	button:[{
												   		value:'取消'
												   	},{
												   		value:'确认兑换',
												   		callback:function(){
												   			$.ajax({
																url:'/jingfang/convert',
																type:'post',
																dataType:'json',
																data:paraNext,
																success:function(data){
																	// console.log(data);
																	if(data.result){																							
																	    location.href = '/h5/views/activity/exchangeNormal.html?phone='+ para.phone;
																	}else{
																		jumi.tips(data.errorMsg);
																	}
																}
															});
												   		}
												   	}]
											   })
										    }else{
										    	location.href = '/h5/views/activity/exchangeResult.html?phone='+ para.phone;
										    }																 
										}
									}
							    });
							}
                    	}
                    }
                },              
				ready:function(){
                   $('#myloading').remove();
				}								
		});	
	  }
	})

});