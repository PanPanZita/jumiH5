define(["jumi","nav","weixin","vue","asyncload","load","scrolltotop"],function(t,i,e,n,o,a,s){var l={pageNum:1,pageSize:15,requestSource:"WAP"};$.ajax({url:"/notice/information/getNoticeList",type:"post",dataType:"json",data:l,success:function(o){"0000"==o.code?null!=o.data&&null!=o.data.noticeList&&o.data.noticeList.length>0?new n({el:"body",components:{"my-information":{template:"#informationTemplate",data:function(){return{inforlists:o.data.noticeList,pageNum:1,pageSize:15,isLoading:0}},methods:{listDetails:function(t){var i=this.inforlists[t].id;0==this.inforlists[t].type?location.href="/h5/views/notice/announcement.html?inforId="+i:1==this.inforlists[t].type?location.href="/h5/views/notice/projectDynamics.html?inforId="+i:2==this.inforlists[t].type&&(1==this.inforlists[t].mediaType?location.href="/h5/views/notice/mediaReport.html?inforId="+i:2==this.inforlists[t].mediaType&&(location.href=this.inforlists[t].linkUrl+"?inforId="+i))}}}},ready:function(){var t=this;i.setActiveNav("index"),$("#myloading").remove(),e.setTitle().setDesc().setImg().setUrl().share(),a.pullup({button:"#loadMoreButton",callback:function(i){var e=t.$children[0];i.pageNum++;var n={pageSize:15,pageNum:i.pageNum,requestSource:"WAP"};$.ajax({url:"/notice/information/getNoticeList",type:"post",dataType:"json",data:n,success:function(t){if("0000"==t.code)if(null!=t.data&&null!=t.data.noticeList&&t.data.noticeList.length>0){for(var n=0;n<t.data.noticeList.length;n++)e.inforlists.push(t.data.noticeList[n]);setTimeout(function(){$(".async").asyncload()},0),i.isLoading=0}else i.isLoading=2,$(i.button).html("-- 我已倾囊相授 --")}})}})}}):(i.setActiveNav("index"),$("#myloading").remove(),e.setTitle().setDesc().setImg().setUrl().share()):t.tips(o.msg)}})});