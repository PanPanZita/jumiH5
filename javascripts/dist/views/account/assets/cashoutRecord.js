define(["jumi","nav","isLogin","isLoginwx","vue","weixin","load","scrolltotop"],function(t,e,a,s,n,o,i,c){var u=localStorage.getItem("token"),r={token:u,requestSource:"WAP",pageSize:10,currentPage:1};a(function(){$.ajax({url:"/userCenter/userAccount/getMyCashList",type:"post",dataType:"json",data:r,success:function(a){"0000"==a.code?new n({el:"body",components:{"my-list":{template:"#listTemplate",data:function(){return{lists:a.data.cashList,pageSize:10,currentPage:1,isLoading:0}},methods:{cancelCashout:function(e,a){var s=this,n={cashId:e,token:u,requestSource:"WAP"};t.alert({title:"温馨提示",skin:"ui-dialog-bankcard",content:"确认取消提现？",button:[{value:"确认",callback:function(){$.ajax({url:"/userCenter/userAccount/cancleCash",type:"post",dataType:"json",data:n,success:function(e){"0000"==e.code?(t.tips("取消提现成功！"),s.lists[a].status=2,s.lists[a].statusShow="用户取消"):(t.tips(e.msg),setTimeout(function(){window.location.href=location.href+"?time="+(new Date).getTime()},2500))}})}},{value:"取消"}]})}}}},ready:function(){var t=this;e.setActiveNav("account"),$("#myloading").remove(),o.setTitle().setDesc().setImg().setUrl().share(),i.pullup({button:"#loadMoreButton",callback:function(e){var a=t.$children[0];e.currentPage++;var s={pageSize:10,currentPage:e.currentPage,token:u,requestSource:"WAP"};$.ajax({url:"/userCenter/userAccount/getMyCashList",type:"post",dataType:"json",data:s,success:function(t){if("0000"==t.code)if(null!=t.data&&null!=t.data.cashList&&t.data.cashList.length>0){for(var s=0;s<t.data.cashList.length;s++)a.lists.push(t.data.cashList[s]);e.isLoading=0}else e.isLoading=2,$(e.button).html("-- 我已倾囊相授 --")}})}})}}):t.tips(a.msg)}})});var l=location.href.split("?code=")[0],d=location.href.split("?code=")[1];if(d){var g=d.split("&state=")[0];s(g,l)}});