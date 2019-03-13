define(['jumi','vue','slidefocus','asyncload','getPara','weixin'],function(jumi,vue,slidefocus,asyncload,getPara,weixin){
  
 var para = getPara.get();
  	$.ajax({
		url:'/band/regNumber.html',
		type:'post',
		dataType:'json',
		timeout:30000,
		data:para,
		success:function(data){	
           // console.log(data);
		    new vue({
				el:'body',
				components:{
                    'my-people':{
                    	template:'#peopleTemplate',
                    	data:function(){
                    		return{
                    			data:data
                    		}
                    	}
                    },
                    'my-index':{
                    	template:'#indexTemplate',
                    	data:function(){
                    		return{
                    			// data:data
                    		}
                    	},
                    	ready:function(){
							slidefocus.init({id:"#slider"});	//////焦点图效果
							$('.async').asyncload();			//////异步加载图片				                                                                                      						
					   }
                    },
                    'my-video':{
						template:'#videoTemplate',
						data:function(){
							return {
								// data:data
								isPlay:true
							}
						},										
						methods:{
							videoWrap:function(){ 
                                this.isPlay = !this.isPlay;							
	                            var oPlayWrap = $("#videoWrap");
								var oVideo = $("#video")[0];
								var oPlayState = $("#playState");
                                if(this.isPlay) {
									oVideo.pause();
						            oPlayState.show();
								} else {
									oVideo.play();
									oPlayState.hide();
								}
							}
						}
					},
					'my-signup':{
						template:'#signupTemplate',
						data:function(){
							return {
								bandName:'',
								division:'',	
								divisions:[
								    {text:'蚌埠赛区',value:'蚌埠赛区'},
								    {text:'阜阳赛区',value:'阜阳赛区'},
								    {text:'亳州赛区',value:'亳州赛区'},
								    {text:'淮南赛区',value:'淮南赛区'},
								    {text:'铜陵赛区',value:'铜陵赛区'},
								    {text:'黄山赛区',value:'黄山赛区'},
								    {text:'芜湖赛区',value:'芜湖赛区'},
								    {text:'合肥赛区',value:'合肥赛区'}
								],	
								username:'',
								school:'',						
								phone:'',
								foundTime:'',//乐队创建时间
		                        //创建时间
								years:[
								    {text:'2017',value:'2017'},
								    {text:'2016',value:'2016'},
								    {text:'2015',value:'2015'},
								    {text:'2014',value:'2014'},
								    {text:'2013',value:'2013'},
								    {text:'2012',value:'2012'},
								    {text:'2011',value:'2011'},
								    {text:'2010',value:'2010'},
								    {text:'2009',value:'2009'},
								    {text:'2008',value:'2008'},
								    {text:'2007',value:'2007'},
								    {text:'2006',value:'2006'},
								    {text:'2005',value:'2005'},
								    {text:'2004',value:'2004'},
								    {text:'2003',value:'2003'},
								    {text:'2002',value:'2002'},
								    {text:'2001',value:'2001'},
								    {text:'2000',value:'2000'},
								    {text:'1999',value:'1999'},
								    {text:'1998',value:'1998'},
								    {text:'1997',value:'1997'},
								    {text:'1996',value:'1996'},
								    {text:'1995',value:'1995'},
								    {text:'1994',value:'1994'},
								    {text:'1993',value:'1993'},
								    {text:'1992',value:'1992'},
								    {text:'1991',value:'1991'}					
								],	
		                        style:'',
		                        cs_experience:'',
		                        yc_experience:'',
		                        // imgs:data.bannerlist
		                        isPlay:false
							}
						},
						methods:{						
							bandNameKeyup:function(){													
								var patrn_length = /^\S{0,27}$/;		

								if(!patrn_length.test(this.bandName)){
									this.bandName = this.bandName.substring(0,27);
								}	
															
							},
							bandNameBlur:function(){	
								var patrn_length = /^\S{0,27}$/;		

								if(!patrn_length.test(this.bandName)){
									this.bandName = this.bandName.substring(0,27);
									jumi.tips('乐队名称不能超过27个字');
								}
							},
							usernameKeyup:function(){
								var patrn_length = /^\S{0,27}$/;			

								if(!patrn_length.test(this.username)){
									this.username = this.username.substring(0,27);
								}							
							},
							usernameBlur:function(){
								var patrn_length = /^\S{0,27}$/;		

								if(!patrn_length.test(this.username)){
									this.username = this.username.substring(0,27);
									jumi.tips('姓名不能超过27个字');
								}
							},
							schoolKeyup:function(){
								var patrn_length = /^\S{0,27}$/;			

								if(!patrn_length.test(this.school)){
									this.school = this.school.substring(0,27);
								}							
							},
							schoolBlur:function(){
								var patrn_length = /^\S{0,27}$/;		

								if(!patrn_length.test(this.school)){
									this.school = this.school.substring(0,27);
									jumi.tips('学校不能超过27个字');
								}
							},
							inputPhoneKeyup:function(){
								var patrn_length = /^\S{11}$/;				

								if(!patrn_length.test(this.phone)){
									this.phone = this.phone.substring(0,11);
								}							
							},
							inputPhoneBlur:function(){
								var that = this;
								var phone = this.phone;
								var patrn_null = /^\S{0}$/;					//非空
								var patrn = /^(13|14|15|16|18|17|19)\d{9}$/;	//手机号码
								var patrn_number = /^[0-9]*$/;				//纯数字

								
								if(patrn_null.test(phone)){
									return;
								}
								
								if(!patrn.test(phone)){
									jumi.tips('请输入正确的手机号！');
									return;
								}

								if(!patrn_number.test(phone)){
									jumi.tips('请输入正确的手机号！');
									return;
								}

								
								var para = {phone:this.phone};
								    $.ajax({
										url: "/band/checkPhone.html",
									    type: "post",
									    dataType: "json",
									    data: para,
									    success:function(data){
									    	// console.log(data);
									    	if(data.result){
									    		return;
									    	}else{
									    		jumi.tips('你已经报过名了！');
									    	}
									    }
									});
							},
							styleKeyup:function(){
								var patrn_length = /^\S{0,50}$/;			

								if(!patrn_length.test(this.style)){
									this.style = this.style.substring(0,50);
								}							
							},
							styleBlur:function(){
								var patrn_length = /^\S{0,50}$/;		

								if(!patrn_length.test(this.style)){
									this.style = this.style.substring(0,50);
									jumi.tips('风格不能超过50个字');
								}
							},
							cs_experienceKeyup:function(){
								var patrn_length = /^\S{0,120}$/;			

								if(!patrn_length.test(this.cs_experience)){
									this.cs_experience = this.cs_experience.substring(0,120);
								}							
							},
							cs_experienceBlur:function(){
								var patrn_length = /^\S{0,120}$/;		

								if(!patrn_length.test(this.cs_experience)){
									this.cs_experience = this.cs_experience.substring(0,120);
									jumi.tips('参赛经历不能超过120个字');
								}
							},
							yc_experienceKeyup:function(){
								var patrn_length = /^\S{0,120}$/;			

								if(!patrn_length.test(this.yc_experience)){
									this.yc_experience = this.yc_experience.substring(0,120);
								}							
							},
							yc_experienceBlur:function(){
								var patrn_length = /^\S{0,120}$/;		

								if(!patrn_length.test(this.yc_experience)){
									this.yc_experience = this.yc_experience.substring(0,120);
									jumi.tips('演出经历不能超过120个字');
								}
							},
							signUp:function(){               
								var para = {
									bandName:this.bandName,
									division:this.division,
									username:this.username,
									school:this.school,
									phone:this.phone,
									foundTime:this.foundTime,
									style:this.style,
									cs_experience:this.cs_experience,
									yc_experience:this.yc_experience
								}
								var bandName = this.bandName;
								var username = this.username;
								var school = this.school;
								var phone = this.phone;
								var style = this.style;			
							    $.ajax({
									url     : "/band/bandApply.html",
									type    : 'post',
									cache   : false,
									dataType: 'json',
									data    : para,
									success: function(data){
										// console.log(data);
										if(data.result){						
											$(".tips1").css({display:"block"});	
						    		        $(".activityWrap").css({display:"block"});	
						    		        $("#signUp").addClass('disabled');
						    		        location.reload();
										}else{
											if(bandName =='' && username == '' && school == '' && phone == ''  && style == ''){
												$("body,html").animate({scrollTop:2000},0);
											}else{
												jumi.tips(data.errorMsg);												
											}                                  
										}
									 }
							    });
							},
							sureBtn:function(){
								$(".tips1").css({display:"none"});
								$(".activityWrap").css({display:"none"});
								$("#signUp").removeClass('disabled');
							}			
						},
						ready:function(){
							weixin.setTitle('梦想玩石新声计划')
							   .setDesc()
							   .setImg('https://hfnewtiming.oss-cn-shanghai.aliyuncs.com/H5_110x110.jpg')
							   .setUrl()
							   .share();
						}
					}
				},
				
		});	
	}
	})
});