define(['jumi','vue','getPara','autoHeight','api'],function(jumi,vue,getPara,autoHeight,api){
	var para = getPara.get();
	var vm = new vue({
		el:'body',
		components:{
			'my-register':{
				template:'#registerTemplate',
				data:function(){
					return {
						phone:'',
						password:'',
						phone_code:'',
						invite_phone:para.invitePhone,
						isShowHide:true,
						isShowHideRegister:true,
						setIntervalID:'',
						setIntervalIDVoice:''
					}
				},
				methods:{
					toShowHide:function(){
						var patrn_null = /^\S{0}$/;							//非空
						var patrn_mobile = /^(13|14|15|16|18|17|19)\d{9}$/;	//手机号码
						var patrn_pwd = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
						
						var boolPhone = patrn_null.test(this.phone) || !patrn_mobile.test(this.phone);
						var boolPassword = patrn_null.test(this.password) || !patrn_pwd.test(this.password);
						
						if(boolPhone || boolPassword){
							this.isShowHide = true;
							$('#getCodeButton').hide();
						}else{
							this.isShowHide = false;
							$('#getCodeButton').show();
						}
					},
					toShowHideResiter:function(){
						var patrn_null = /^\S{0}$/;							//非空
						var patrn_length_fixed = /^\S{4}$/;					//固定长度区间
						var patrn_mobile = /^(13|14|15|16|18|17|19)\d{9}$/;	//手机号码
						var patrn_pwd = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
						
						var boolPhone = patrn_null.test(this.phone) || !patrn_mobile.test(this.phone);
						var boolPassword = patrn_null.test(this.password) || !patrn_pwd.test(this.password);
						var boolCode = patrn_null.test(this.phone_code) || !patrn_length_fixed.test(this.phone_code);
						
						if(boolPhone || boolPassword || boolCode){
							this.isShowHideRegister = true;
						}else{
							this.isShowHideRegister = false;
						}
					},
					inputPhoneBlur:function(){
						var that = this;
						var val = this.phone;
						var patrn_null = /^\S{0}$/;					//非空
						var patrn = /^(13|14|15|16|18|17|19)\d{9}$/;	//手机号码
						
						if(patrn_null.test(val)){
							return;
						}
						
						if(!patrn.test(val)){
							jumi.tips('手机号码格式不正确！');
							return;
						}
						
						var para = {phone:this.phone};
						$.ajax({
							url: "/common/checkPhoneIsExist",
						    type: "post",
						    dataType: "json",
						    data: para,
						    success:function(data){
//						    	console.log(data);
						    	if(data.result){
						    		return;
						    	}else{						 
						    		$(".tips1").css({display:"block"});	
						    		$(".activityWrap").css({display:"block"});					    		
						    	}
						    }
						});
					},
					sureBtn:function(){
						var that = this;
						var val = this.phone;
						$(".tips1").css({display:"none"});
						$(".activityWrap").css({display:"none"});
						that.phone = '';
					},
					inputPhoneKeyup:function(){
						var patrn_length = /^\S{11}$/;			//长度区间
						var patrn_number = /^[0-9]*$/;              //纯数字

                        if(!patrn_number.test(this.phone)){
                            jumi.tips('手机号码格式不正确！');
                            return;
                        }
						
						if(!patrn_length.test(this.phone)){
							this.phone = this.phone.substring(0,11);
						}
						this.toShowHide();
						this.toShowHideResiter();
					},
					inputPasswordBlur:function(){
						var patrn_null = /^\S{0}$/;					//非空
						var patrn_pwd = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
						
						if(patrn_null.test(this.password)){
							return;
						}
						
						if(!patrn_pwd.test(this.password)){
							jumi.tips('您设置的密码过于简单');
							return;
						}						
						
					},
					inputPasswordKeyup:function(){
						var patrn_null = /^\S{0}$/;					//非空
						var patrn_length = /^\S{6,16}$/;			//长度区间
						
						if(patrn_null.test(this.password)){
							return;
						}
						
						if(!patrn_length.test(this.password)){
							this.password = this.password.substring(0,16);
						}
						
						this.toShowHide();
						this.toShowHideResiter();
					},
					inputCodeKeyup:function(){
						var patrn_null = /^\S{0}$/;					//非空
						var patrn_length = /^\S{4}$/;			//长度区间
						
						if(patrn_null.test(this.phone_code)){
							return;
						}
						
						if(!patrn_length.test(this.phone_code)){
							this.phone_code = this.phone_code.substring(0,4);
						}else{
//							var para = {phone_code:this.phone_code};
//							$.ajax({
//								url: "/common/validPhoneCode",
//							    type: "post",
//							    dataType: "json",
//							    data: para,
//							    success:function(data){
//							    	if(data.result){
//							    		return;
//							    	}else{
//							    		jumi.tips('验证码错误！');
//							    	}
//							    }
//							});
						}
						
						this.toShowHideResiter();
					},
					inputInvitePhone:function(){
						var val = this.invite_phone;
						var patrn_null = /^\S{0}$/;					//非空
						var patrn = /^(13|14|15|16|18|17|19)\d{9}$/;	//手机号码
						
						if(patrn_null.test(val)){
							return;
						}
						
						if(!patrn.test(val)){
							jumi.tips('手机号码格式不正确！');
							this.invite_phone = '';
							return;
						}
						
						var para = {invite_phone:this.invite_phone};
						$.ajax({
							url: "/common/validateUserIsExist",
						    type: "post",
						    dataType: "json",
						    data: para,
						    success:function(data){
//						    	console.log(data);
						    	if(data.result){
						    		return;
						    	}else{
						    		jumi.tips('邀请人不存在！');
						    	}
						    }
						});
					},
					protocols:function(){
						var len = $('#protocolBox').children().length
						if(!len){
							$('#protocolBox').load('/common/protocol.html',function(){
								jumi.alert({
									title:"聚米众筹用户注册服务协议",
									content:$("#protocolBox").html(),
									button:[{
										value:"知道了"
									}]
								});
							});
						}else{
							jumi.alert({
								title:"聚米众筹用户注册服务协议",
								content:$("#protocolBox").html(),
								button:[{
									value:"知道了"
								}]
							});
						}
					},
					ok:function(){
						var para = {
								phone:this.phone,
								password:this.password,
								phone_code:this.phone_code,
								invite_phone:this.invite_phone
						}
						
					    $.ajax({
							url     : "/common/register",
							type    : 'post',
							cache   : false,
							dataType: 'json',
							data    : para,
							success: function(data){
								if(data.result){						
                                    location.href = '/h5/views/training/training.html';
								}else{
									jumi.tips(data.errorMsg);
								}
							 }
					    });
					},
					experienceNow:function(){
						var that = this;
						$("body,html").animate({scrollTop:0},0);
					},
					//发送语音验证码
					sendVoiceCode:function(){
						var that = this;
						$.ajax({
				    	 	type:"post",
							url:"/common/sendSpeechValidation",
							data:{key:'register',phone:that.phone},
							dataType:"json",
							success:function(data){
								//获取成功
								if(data.result){
									that.$root.$children[0].countdown();
									that.$root.$children[0].countdownVoice();
									jumi.tips('语音验证码发送成功，请注意接收～');
								}else{
									if(data.flag == 1){
										jumi.tips('验证码获取过于频繁，稍后再尝试～');
									}else if(data.flag == 2){
										jumi.tips('未短信验证码，请先获取短信验证码～');
									}
								}
							}
						});
					},
					///倒计时
					countdown:function(){
						var that = this;
						clearInterval(that.setIntervalID);
						var thiz = $('#getCodeButtonMask');
						var time = 60;
						thiz.addClass('disabled');
						that.setIntervalID = setInterval(function(){
							time--;
							thiz.html('获取验证码（' + time +"）");
							if(time==0){
								clearInterval(that.setIntervalID);
								time = 60;
								thiz.removeClass("disabled").html("获取验证码");
								LUOCAPTCHA.reset();
							}
						},1000);
					},
					///语音倒计时
					countdownVoice:function(){
						var that = this;
						clearInterval(that.setIntervalIDVoice);
						var thiz = $('#getVoiceCodeButton');
						var timeVoice = 40;
						thiz.addClass('disabled');
						that.setIntervalIDVoice = setInterval(function(){
							timeVoice--;
							thiz.html('发送语音验证码（' + timeVoice +"）");
							if(timeVoice == 0){
								clearInterval(that.setIntervalIDVoice);
								timeVoice = 40;
								thiz.removeClass("disabled").html("发送语音验证码");
							}
						},1000);
					}
				}
			}
		},
		ready:function(){
			var that = this;
			$('#myloading').remove();
			autoHeight.setHeight();
			
			///将人机验证生成的代码（按钮）添加到相应位置
			$('#getCodeButtonBox').append($('#getCodeButton'));
			
			///获取验证码
			getResponse = function(resp){
			     $.ajax({
			    	 	type:"post",
						url:"/common/validatePicAndSendSms",
						data:{value:resp},
						dataType:"json",
						success:function(data){
							if(data.result){
								that.$children[0].countdown();
								that.$children[0].countdownVoice();
							}
						}
			     });
			}
		}
	});
	
});