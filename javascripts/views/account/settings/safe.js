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
      url: "/userCenter/setting/isStatAcct",
      type: "post",
      data: parainit,
      dataType: "json",
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-safe": {
                template: "#safeTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                },
                methods: {
                  tips: function() {
                    jumi.alert({
                      skin: "ui-dialog-bankcard",
                      title: "提示",
                      content: "请先开户，再修改支付密码～",
                      button: [
                        {
                          value: "稍后",
                          callback: function() {}
                        },
                        {
                          value: "去开户",
                          callback: function() {
                            location.href =
                              "/h5/views/account/settings/bankcardToBind.html?redirectURL=" +
                              location.pathname +
                              location.search;
                          }
                        }
                      ]
                    });
                  },
                  tipsback: function() {
                    jumi.alert({
                      skin: "ui-dialog-bankcard",
                      title: "提示",
                      content: "请先开户，再找回支付密码～",
                      button: [
                        {
                          value: "稍后",
                          callback: function() {}
                        },
                        {
                          value: "去开户",
                          callback: function() {
                            location.href =
                              "/h5/views/account/settings/bankcardToBind.html?redirectURL=" +
                              location.pathname +
                              location.search;
                          }
                        }
                      ]
                    });
                  }
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
