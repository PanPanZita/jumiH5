define(["jumi","nav","weixin","vue","getPara","DateFormat"],function(e,t,i,a,n,o){var c=n.get(),d=c.preType?c.preType:0;$.ajax({url:"/notice/information/getNoticeById",type:"post",dataType:"json",data:{noticeId:c.inforId,requestSource:"WAP",preType:d},success:function(e){new a({el:"body",components:{"my-dynamic":{template:"#dynamicTemplate",data:function(){return{data:e.data,itemBasicInfoResVO:e.data?e.data.itemBasicInfoResVO:{},jmNotice:e.data?e.data.jmNotice:{},jmNoticeText:e.data?e.data.jmNoticeText:{},jmNotices:e.data?e.data.jmNotices:{},idz:c.inforId}},methods:{listDetails:function(e){var t=this.jmNotices[e].id;location.href="/h5/views/notice/projectDynamics.html?inforId="+t}},filters:{timeStr:function(e){return new Date(e).Format("yyyy-MM-dd hh:mm")}}}},ready:function(){t.setActiveNav("index"),$("#myloading").remove();var e=this,a=e.$children[0].jmNotice.title;e.$children[0].jmNotice.headDescription&&$("meta[name='description']").attr("content",e.$children[0].jmNotice.headDescription),e.$children[0].jmNotice.headKeyword&&$("meta[name='keywords']").attr("content",e.$children[0].jmNotice.headKeyword),e.$children[0].jmNotice.headTitle&&$("title").text(e.$children[0].jmNotice.headTitle),i.setTitle(a).setDesc().setImg().setUrl().share()}})}})});