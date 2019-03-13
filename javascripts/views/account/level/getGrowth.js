define(["jquery", "isLogin", "isLoginwx", "vue", "weixin"], function(
  $,
  isLogin,
  isLoginwx,
  vue,
  weixin
) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/setting/getMemberShipRule",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-growth": {
                template: "#growthTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                }
              }
            },
            ready: function() {
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
