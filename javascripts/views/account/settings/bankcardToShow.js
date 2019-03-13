define(["jumi", "nav", "isLogin", "isLoginwx", "vue", "weixin"], function(
  jumi,
  nav,
  isLogin,
  isLoginwx,
  vue,
  weixin
) {
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/userAccount/getBindCardInfo",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-backcard": {
                template: "#backcardTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                },
                methods: {
                  addBankcard: function() {
                    var that = this;
                    //   判断有无本地银行卡
                    if (that.data.bankHistoryNum > 0) {
                      location.href =
                        "/h5/views/account/settings/banklist.html";
                    } else {
                      location.href =
                        "/h5/views/account/settings/bankcardToBindAndCashout.html" +
                        location.search;
                    }
                  },
                  changeBank: function() {
                    var that = this;
                    if (that.data.num < 3) {
                      jumi.alert({
                        skin: "ui-dialog-bankcard",
                        title: "提示",
                        content:
                          "每个用户每天最多提供3次更换银行卡的机会，是否确认当前操作？",
                        button: [
                          {
                            value: "取消",
                            callback: function() {}
                          },
                          {
                            value: "确认",
                            callback: function() {
                              var paragetcode = {
                                phone: that.data.userPhone
                              };
                              $.ajax({
                                url: "/common/authcode/getPhoneCode",
                                type: "post",
                                dataType: "json",
                                data: paragetcode,
                                success: function(data) {
                                  // console.log(data);
                                  if (data.code == "0000") {
                                    location.href =
                                      "/h5/views/account/settings/unbindValidate.html?phone=" +
                                      that.data.userPhone;
                                  } else {
                                    jumi.tips(data.msg);
                                  }
                                }
                              });
                            }
                          }
                        ]
                      });
                    } else {
                      jumi.alert({
                        title: "提示",
                        content: "抱歉，您今日的换卡机会已用完。",
                        button: [
                          {
                            value: "知道了",
                            callback: function() {}
                          }
                        ]
                      });
                    }
                  }
                }
              }
            },
            ready: function() {
              var that = this;
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

  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
