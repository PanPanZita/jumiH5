define(["jumi","tab","vue","isLogin","isLoginwx","getPara","weixin"],function(e,t,r,a,o,n,d){var s=n.get(),c=localStorage.getItem("token"),i=s.address_id?s.address_id:0,u={token:c,orderId:s.orderId,requestSource:"WAP",addressId:i};a(function(){$.ajax({url:"/userCenter/personalCenter/orderinfo",type:"get",data:u,success:function(t){"0000"==t.code?new r({el:"body",components:{"my-active":{template:"#activeTemplate",data:function(){return{data:t.data,remark:t.data.remark,isIOSShow:"ios"==localStorage.fromapp}},filters:{timeFilter:function(e){var t=new Date(e),r=t.getFullYear(),a=t.getMonth()+1;a=a<10?"0"+a:a;var o=t.getDate();o=o<10?"0"+o:o;var n=t.getHours();n=n<10?"0"+n:n;var d=t.getMinutes();d=d<10?"0"+d:d;var s=t.getSeconds();return s=s<10?"0"+s:s,r+"-"+a+"-"+o+" "+n+":"+d+":"+s}},methods:{ok:function(){var t=this;if(1==t.data.orderType&&!t.data.addressId)return void e.tips("请完善收货地址");var r=t.data.addressId?t.data.addressId:0,a={addressId:r,orderId:s.orderId,remark:t.remark,requestSource:"WAP",token:c};e.alert({skin:"ui-dialog-bankcard",content:"聚小米提醒您，是否确认订单？",button:[{value:"取消"},{value:"确认订单",callback:function(){$.ajax({url:"/userCenter/personalCenter/checkOrder",type:"post",dataType:"json",data:a,success:function(t){"0000"==t.code?location.reload():e.tips(t.msg)}})}}]})},receive:function(){var t={orderId:s.orderId,requestSource:"WAP",token:c};e.alert({skin:"ui-dialog-bankcard",content:"聚小米提醒您，是否确认收货？",button:[{value:"取消"},{value:"确认收货",callback:function(){$.ajax({url:"/userCenter/personalCenter/checkOrderStatus",type:"post",dataType:"json",data:t,success:function(t){"0000"==t.code?location.reload():e.tips(t.msg)}})}}]})},deleteOrder:function(){var t={orderId:s.orderId,requestSource:"WAP",token:c};e.alert({skin:"ui-dialog-bankcard",content:"聚小米提醒您，是否删除订单？",button:[{value:"取消"},{value:"删除",callback:function(){$.ajax({url:"/userCenter/personalCenter/deleteorder",type:"post",dataType:"json",data:t,success:function(t){"0000"==t.code?location.replace("/h5/views/account/active/activeRecord.html"):e.tips(t.msg)}})}}]})}}}},ready:function(){var e=this;$("#myloading").remove(),1==e.$children[0].data.orderStatus?$("#remarkDom").prop("disabled",!1):$("#remarkDom").prop("disabled",!0),d.setTitle().setDesc().setImg().setUrl().share()}}):e.tips(t.msg)},error:function(e){console.error(e)}})});var l=location.href.split("?code=")[0],p=location.href.split("?code=")[1];if(p){var v=p.split("&state=")[0];o(v,l)}});