define(["jumi","vue","getPara","wxBackbtn"],function(e,t,i,o){var d=i.get(),n=location.href.split("&redirectUrl=")[1],a=n.split("?invitorUserId=")[1],s=localStorage.getItem("itemFlag")?localStorage.getItem("itemFlag"):"no";new t({el:"body",components:{"my-binding":{template:"#bindingTemplate",data:function(){return{headImageUrl:d.headImageUrl,nickName:decodeURI(d.nickName),phone:"",phoneCode:"",countTime:60,setIntervalCode:null,flagVoice:!0,sliderSuccess:!1}},watch:{phone:function(e,t){var i=/^1\d{10}$/,o=/^\d{4}$/,d=i.test(this.phone),n=o.test(this.phoneCode);d&&n?($(".goBinding").removeAttr("disabled"),$(".goBinding").removeClass("disabled")):($(".goBinding").attr("disabled","disabled"),$(".goBinding").addClass("disabled"))},phoneCode:function(e,t){var i=/^1\d{10}$/,o=/^\d{4}$/,d=i.test(this.phone),n=o.test(this.phoneCode);d&&n?($(".goBinding").removeAttr("disabled"),$(".goBinding").removeClass("disabled")):($(".goBinding").attr("disabled","disabled"),$(".goBinding").addClass("disabled"))}},methods:{inputPhoneKeyup:function(){var e=/^1\d{10}$/;e.test(this.phone)&&!this.sliderSuccess?($(".getCode").removeAttr("disabled"),$(".getCode").removeClass("disabled")):($(".getCode").attr("disabled","disabled"),$(".getCode").addClass("disabled"))},getVoicecode:function(){var t=this;if(t.flagVoice){var i={phone:t.phone,requestSource:"WAP"};t.flagVoice=!1,$.ajax({url:"/common/authcode/voiceCode",type:"get",datatype:"json",data:i,success:function(i){"0000"==i.code?e.tips("语音验证码发送成功，请注意接听来电..."):e.tips(i.msg),setTimeout(function(){t.flagVoice=!0},5e3)}})}},getCode:function(){var t=this;$(".getVoicecode").removeAttr("disabled"),$(".getVoicecode").removeClass("disabled");var i=["FFFF0N00000000005AD9",(new Date).getTime(),Math.random()].join(":"),o=NoCaptcha.init({renderTo:"#sliderNc",appkey:"FFFF0N00000000005AD9",scene:"nc_register_h5",token:i,trans:{key1:"code0"},elementID:["usernameID"],is_Opt:0,language:"cn",timeout:1e4,retryTimes:5,errorTimes:5,inline:!1,apimap:{},bannerHidden:!0,initHidden:!0,callback:function(o){var d={phone:t.phone,scence:"nc_register_h5",sessionId:o.csessionid,sig:o.sig,token:i};$.ajax({url:"/common/authcode/slidValidate",type:"post",datatype:"json",data:d,success:function(i){"0000"==i.code?(e.tips("验证码发送成功，请注意查收..."),clearInterval(t.setIntervalCode),t.sliderSuccess=!0,$(".getCode").attr("disabled","disabled"),$(".getCode").addClass("disabled"),t.setIntervalCode=setInterval(function(){t.countTime--,$(".getCode").html(t.countTime+"s"),t.countTime<=0&&(clearInterval(t.setIntervalCode),t.sliderSuccess=!1,t.countTime=60,$(".getCode").html("重新获取"),$(".getCode").removeAttr("disabled"),$(".getCode").removeClass("disabled"))},1e3)):e.tips(i.msg)}})},error:function(e){}});NoCaptcha.setEnabled(!0),o.reset(),NoCaptcha.upLang("cn",{LOADING:"加载中...",SLIDER_LABEL:"请按住滑块，拖动到最右边",CHECK_Y:"验证通过",ERROR_TITLE:"非常抱歉，这出错了...",CHECK_N:"验证未通过",OVERLAY_INFORM:"经检测你当前操作环境存在风险，请输入验证码",TIPS_TITLE:"验证码错误，请重新输入"}),o.show(),$(".getCode").attr("disabled","disabled"),$(".getCode").addClass("disabled")},goBinding:function(){var t=a?a:"",i={phone:this.phone,phoneCode:this.phoneCode,openId:d.openId,unionId:d.unionId,requestSource:"WAP",itemLabel:s,invitorUserId:t};$.ajax({url:"/weixin/bindWeixin",type:"post",data:i,dataType:"json",success:function(t){"0000"==t.code?(localStorage.setItem("token",t.data.token),a?location.href=n.split("?invitorUserId=")[0]:location.href=location.href.split("&redirectUrl=")[1]):e.tips(t.msg)}})}}}},ready:function(){$("#myloading").remove(),"/h5/views/activity/midAutumn.html"==n&&o.setReturnUrl()}})});