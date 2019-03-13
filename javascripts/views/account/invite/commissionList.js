define([
  "nav",
  "tab",
  "vue",
  "scrolltotop",
  "asyncload",
  "isLogin",
  "isLoginwx",
  "getPara",
  "weixin"
], function(
  nav,
  tab,
  vue,
  scrolltotop,
  asyncload,
  isLogin,
  isLoginwx,
  getPara,
  weixin
) {
  var token = localStorage.getItem("token");
  var outpara = getPara.get();
  var parainit = {
    token: token,
    assmentId: outpara.id,
    requestSource: "WAP",
    currentPage: 1,
    pageSize: 10
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/financialManager/getPastPerCommssionList",
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
  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
