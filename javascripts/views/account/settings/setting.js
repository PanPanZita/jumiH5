define(["jumi", "nav", "isLogin", "isLoginwx", "vue", "weixin"], function(
  jumi,
  nav,
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
      url: "/userCenter/setting/getUserPhone",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-setting": {
                template: "#settingTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                },
                methods: {
                  toLink: function() {
                    location.href =
                      "/h5/views/account/settings/bankcardToBind.html?redirectURL=" +
                      location.pathname +
                      location.search;
                  },
                  showPhone: function() {
                    jumi.alert({
                      content:
                        '<p>聚小米提醒您，为了您的账户安全，需修改手机号请联系人工客服：<a href="tel:400-801-4680" class="clr-strike">400-801-4680</a></p>',
                      button: [
                        {
                          value: "返回"
                        }
                      ]
                    });
                  },
                  //退出
                  exit: function() {
                    $.ajax({
                      url: "/userCenter/setting/logout",
                      type: "post",
                      dataType: "json",
                      data: parainit,
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          location.href = "/h5/views/main/index.html";
                        }
                      }
                    });
                  }
                },
                filters: {
                  phoneStr: function(phone) {
                    // 以下两个方法都行
                    return phone.substring(0, 3) + "****" + phone.substring(7);
                    // return phone.substr(0,3)+'****'+phone.substr(7);
                  }
                }
              }
            },
            ready: function() {
              nav.setActiveNav("account");
              $("#myloading").remove();
              //   微信登陆--该链接后面不带参数
              var url = location.href.split("?code=")[0];
              var locationCodepar = location.href.split("?code=")[1];
              if (locationCodepar) {
                var locationCode = locationCodepar.split("&state=")[0];
                isLoginwx(locationCode, url);
              }
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
