define(["jumi","weixin","getPara","isLogin","isLoginwx","vue","nav"],function(t,e,a,i,n,r,o){var s=localStorage.getItem("token"),c=location.href,l={itemId:1,requestSource:"WAP"};$.ajax({url:"/item/getItemBasicInfo",type:"post",dataType:"json",data:l,success:function(a){console.log(a),"0000"==a.code&&new r({el:"body",components:{"my-item":{template:"#itemTemplate",data:function(){return{data:a.data,noviceStatus:a.data.noviceStatus}},filters:{tenthousand:function(t){return t>=1e4?t/1e4+" 万元":t+" 元"},countFilter:function(t){var e=new Number(t);return e>99?e="99+":0==e&&(e=""),e}},methods:{toLink:function(){i(function(){var e={gearId:1,token:s,requestSource:"WAP"};$.ajax({url:"/needLogin/buy/toSupportCheckNovice",type:"post",data:e,dataType:"json",success:function(e){if("0000"==e.code){if(!e.data.noviceUser)return void t.alert({title:"提示",content:"聚小米提醒您：<br>您已经不是新人用户了哦~",button:[{value:"知道了"}]});if(!e.data.statAcct)return void(location.href="/h5/views/account/settings/bankcardToBind.html");if(!e.data.statBind)return void(location.href="/h5/views/account/settings/bankcardToBindAndCashout.html");1==e.data.costType&&(location.href="/h5/views/payment/investCart.html?itemid=1&gearId=1")}else t.tips(e.msg)}})})},addToWeixin:function(){var e="",i="",n="";i="ios"==localStorage.fromapp?'<span class="clr-strike">微信扫描</span> 二维码，添加客服微信':"android"==localStorage.fromapp?'<span class="clr-strike">微信扫描</span> 二维码，添加客服微信':'<span class="clr-strike">长按</span> 识别二维码，添加客服微信',e=a.data.wxImagePath?"\t<p>"+i+'</p>\t<p><img src="'+a.data.wxImagePath+'" alt="" style="width:auto;height:15rem;margin:0 auto;"></p>':"<p>暂无讨论群，请随时关注！</p>",n='<div style="text-align:center;">'+e+"</div>",t.alert({title:"客服二维码",content:n,button:!1})}}}},ready:function(){var t=this;$("#myloading").remove();var a=location.href.split("?code=")[0],i=location.href.split("?code=")[1];if(i){var r=i.split("&state=")[0];n(r,a)}0==t.$children[0].noviceStatus&&o.setActiveNav("account");var s=0;if(t.$children[0].data.investPhoneList&&t.$children[0].data.investPhoneList.length>1&&(s=setInterval(function(){var t=$("#slider li:first"),e=$("#slider li").eq(1),a=$("#slider li:last");t.animate({opacity:0},1e3,function(){t.insertAfter(a),e.animate({opacity:1},1e3)})},3e3)),"ios"==localStorage.fromapp){var l={title:t.$children[0].data.shareTitle,desc:t.$children[0].data.shareContent,img:t.$children[0].data.sharePic,url:c};window.webkit.messageHandlers.share.postMessage(l)}else if("android"==localStorage.fromapp){var l={title:t.$children[0].data.shareTitle,desc:t.$children[0].data.shareContent,img:t.$children[0].data.sharePic,url:c};window.Android.callAndroidAction("0",JSON.stringify(l))}else e.setTitle(t.$children[0].data.shareTitle).setDesc(t.$children[0].data.shareContent).setImg(t.$children[0].data.sharePic).setUrl(c).share(!0)}})}})});