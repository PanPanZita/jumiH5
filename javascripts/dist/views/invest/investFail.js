define(["getPara","weixin","vue","getPara"],function(e,t,i,e){var n=e.get(),a=decodeURI(n.errorMessage),r=n.itemid;new i({el:"body",components:{"my-fail":{template:"#failTemplate",data:function(){return{errorMessage:a,itemid:r}},methods:{backindex:function(){location.href="/h5/views/main/index.html"},trynew:function(){location.href="/h5/views/training/training.html"},"try":function(){location.href="/h5/views/invest/investGrade.html?itemid="+r}}}},ready:function(){$("#myloading").remove(),t.setTitle().setDesc().setImg().setUrl().share()}})});