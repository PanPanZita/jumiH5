define(["jumi","vue","getPara","isLogin","isLoginwx","weixin"],function(e,t,a,i,n,r){var o=a.get(),l=o.isNoviceUser,s=localStorage.getItem("token"),d={token:s,requestSource:"WAP"};i(function(){0==l?new t({el:"body",components:{"my-detail":{template:"#investDetailTemplate",data:function(){return{isNoviceUser:l}}}},ready:function(){$("#myloading").remove()}}):1==l&&$.ajax({url:"/userCenter/investBill/getNoviceInvestBillDetail",type:"post",dataType:"json",data:d,success:function(a){"0000"==a.code&&new t({el:"body",components:{"my-detail":{template:"#investDetailTemplate",data:function(){return{data:a.data,isNoviceUser:l}},methods:{showInfo:function(){var t=this;e.alert({title:"回报内容",content:t.data.returnContent,button:!1})},ok:function(t){var a={investBillId:t,requestSource:"WAP",token:s};e.alert({skin:"ui-dialog-bankcard",content:"聚小米提醒您，确认收货后订单交易完成。",button:[{value:"取消"},{value:"确认收货",callback:function(){$.ajax({url:"/userCenter/investBill/confirmReceipt",type:"post",dataType:"json",data:a,success:function(t){"0000"==t.code||e.tips("确认收货失败！")}})}}]})}}}},ready:function(){var e=this;if($("#myloading").remove(),"ios"==localStorage.fromapp){var t={title:e.$children[0].data.shareTitle,desc:e.$children[0].data.shareContent,img:e.$children[0].data.sharePic,url:e.$children[0].data.shareUrl};window.webkit.messageHandlers.share.postMessage(t)}else if("android"==localStorage.fromapp){var t={title:e.$children[0].data.shareTitle,desc:e.$children[0].data.shareContent,img:e.$children[0].data.sharePic,url:e.$children[0].data.shareUrl};window.Android.callAndroidAction("0",JSON.stringify(t))}else r.setTitle(e.$children[0].data.shareTitle).setDesc(e.$children[0].data.shareContent).setImg(e.$children[0].data.sharePic).setUrl(e.$children[0].data.shareUrl).share()}})}})});var c=location.href.split("&code=")[0],u=location.href.split("&code=")[1];if(u){var h=u.split("&state=")[0];n(h,c)}});