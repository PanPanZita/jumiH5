define(["jumi","weixin","getPara","vue"],function(e,t,a,i){var n=(localStorage.getItem("token"),location.href),r={itemId:1,requestSource:"WAP"};$.ajax({url:"/item/getItemBasicInfo",type:"post",dataType:"json",data:r,success:function(e){"0000"==e.code&&new i({el:"body",components:{"my-item":{template:"#itemTemplate",data:function(){return{data:e.data,noviceStatus:e.data.noviceStatus}},filters:{tenthousand:function(e){return e>=1e4?e/1e4+" 万元":e+" 元"}}}},ready:function(){var e=this,a=0;if(e.$children[0].data.investPhoneList&&e.$children[0].data.investPhoneList.length>1&&(a=setInterval(function(){var e=$("#slider li:first"),t=$("#slider li").eq(1),a=$("#slider li:last");e.animate({opacity:0},1e3,function(){e.insertAfter(a),t.animate({opacity:1},1e3)})},3e3)),"ios"==localStorage.fromapp){var i={title:e.$children[0].data.shareTitle,desc:e.$children[0].data.shareContent,img:e.$children[0].data.sharePic,url:n};window.webkit.messageHandlers.share.postMessage(i)}else if("android"==localStorage.fromapp){var i={title:e.$children[0].data.shareTitle,desc:e.$children[0].data.shareContent,img:e.$children[0].data.sharePic,url:n};window.Android.callAndroidAction("0",JSON.stringify(i))}else t.setTitle(e.$children[0].data.shareTitle).setDesc(e.$children[0].data.shareContent).setImg(e.$children[0].data.sharePic).setUrl(n).share(!0)}})}})});