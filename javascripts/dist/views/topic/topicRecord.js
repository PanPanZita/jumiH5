define(["nav","vue","getPara","weixin","load","scrolltotop"],function(a,t,e,o,r,i){var s=e.get(),n=s.special_id,d={activityId:n,currentPage:1,pageSize:20,requestSource:"WAP"};$.ajax({url:"/activity/getExchangeOrLotteryList",type:"post",dataType:"json",data:d,success:function(e){"0000"==e.code&&new t({el:"body",components:{"my-record":{template:"#recordTemplate",data:function(){return{data:e.data,awardLogList:e.data.awardLogList,currentPage:1,isLoading:0,pageSize:20,isIOSShow:"ios"==localStorage.fromapp}},methods:{}}},ready:function(){var t=this;a.setActiveNav("discover"),$("#myloading").remove(),o.setTitle().setDesc().setImg().setUrl().share(),r.pullup({button:"#loadMoreButton",callback:function(a){var e=t.$children[0];a.currentPage++;var o={activityId:n,pageSize:20,currentPage:a.currentPage,requestSource:"WAP"};$.ajax({url:"/activity/getExchangeOrLotteryList",type:"post",dataType:"json",data:o,success:function(t){if("0000"==t.code)if(null!=t.data&&null!=t.data.awardLogList&&t.data.awardLogList.length>0){for(var o=0;o<t.data.awardLogList.length;o++)e.awardLogList.push(t.data.awardLogList[o]);a.isLoading=0}else a.isLoading=2,$(a.button).html("-- 我已倾囊相授 --")}})}})}})}})});