define([
  "nav",
  "tab",
  "vue",
  "scrolltotop",
  "isLogin",
  "isLoginwx",
  "asyncload",
  "weixin"
], function(nav, tab, vue, scrolltotop, isLogin, isLoginwx, asyncload, weixin) {
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP",
    currentPage: 1,
    pageSize: 10
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/inviteFriend/getPastPerRewardList",
      type: "get",
      data: parainit,
      dataType: "json",
      success: function(data) {
        if (data.code == "0000") {
          if (data.data != null) {
            new vue({
              el: "body",
              components: {
                "my-record": {
                  template: "#recordTemplate",
                  data: function() {
                    return {
                      data: data,
                      items: data.data,
                      currentPage: 1,
                      pageSize: 10,
                      isLoading: 0
                    };
                  }
                }
              },
              ready: function() {
                nav.setActiveNav("account");
                $("#myloading").remove();
                //分享
                weixin
                  .setTitle()
                  .setDesc()
                  .setImg()
                  .setUrl()
                  .share();
              }
            });
          }
        } else {
          jumi.tips(data.msg);
        }
      }
    });
  }); //isLogin的结束
  //   微信登陆--该链接后面不带参数
  var url = location.href.split("?code=")[0];
  var locationCodepar = location.href.split("?code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
