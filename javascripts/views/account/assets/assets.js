define(["jumi", "tab", "isLogin", "isLoginwx", "vue", "weixin"], function(
  jumi,
  tab,
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
      url: "/userCenter/userAccount/getMyAccountInfo",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-assets": {
                template: "#assetsTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                }
              },
              "my-detail": {
                template: "#detailTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                }
              },
              "my-foot": {
                template: "#footTemplate",
                data: function() {
                  return {
                    data: data.data
                  };
                },
                methods: {
                  recharge: function() {
                    var that = this;
                    var paraisbind = {
                      token: token,
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/userCenter/userAccount/isBindCard",
                      type: "post",
                      dataType: "json",
                      data: paraisbind,
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          if (
                            that.data.statBind == 0 ||
                            that.data.statBind == 3 ||
                            that.data.statBind == 9
                          ) {
                            //statBind的状态值0,3,9分别表示未绑卡，解绑成功，绑卡失败
                            jumi.alert({
                              title: "提示",
                              content:
                                '<p class="textcenter">先绑定银行卡后才能充值哦~</p>',
                              button: [
                                {
                                  value: "去绑卡",
                                  callback: function() {
                                    location.href =
                                      "/h5/views/account/settings/bankcardToBindAndCashout.html" +
                                      location.search;
                                  }
                                }
                              ]
                            });
                          } else if (that.data.statBind == 1) {
                            //statBind的状态值1表示绑卡处理中
                            jumi.alert({
                              title: "提示",
                              content:
                                '<p class="textcenter">正在绑卡中，请稍后操作</p>',
                              button: [
                                {
                                  value: "知道了",
                                  callback: function() {}
                                }
                              ]
                            });
                          } else if (that.data.statBind == 2) {
                            //statBind的状态值2表示解绑处理中
                            jumi.alert({
                              title: "提示",
                              content:
                                '<p class="textcenter">正在解绑中，请稍后操作</p>',
                              button: [
                                {
                                  value: "知道了",
                                  callback: function() {}
                                }
                              ]
                            });
                          } else if (
                            that.data.statBind == 4 ||
                            that.data.statBind == 8
                          ) {
                            //statBind的状态值4，8分别表示解绑失败和绑卡成功
                            location.href = "recharge.html" + location.search;
                          }
                        } else {
                          jumi.tips(data.msg);
                        }
                      } //success结尾
                    });
                  },
                  cashout: function() {
                    var that = this;
                    var paraisbind = {
                      token: token,
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/userCenter/userAccount/isBindCard",
                      type: "post",
                      dataType: "json",
                      data: paraisbind,
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          if (
                            that.data.statBind == 0 ||
                            that.data.statBind == 3 ||
                            that.data.statBind == 9
                          ) {
                            //statBind的状态值0,3,9分别表示未绑卡，解绑成功，绑卡失败
                            jumi.alert({
                              title: "提示",
                              content:
                                '<p class="textcenter">先绑定银行卡后才能提现哦~</p>',
                              button: [
                                {
                                  value: "去绑卡",
                                  callback: function() {
                                    location.href =
                                      "/h5/views/account/settings/bankcardToBindAndCashout.html" +
                                      location.search;
                                  }
                                }
                              ]
                            });
                          } else if (that.data.statBind == 1) {
                            //statBind的状态值1表示绑卡处理中
                            jumi.alert({
                              title: "提示",
                              content:
                                '<p class="textcenter">正在绑卡中，请稍后操作</p>',
                              button: [
                                {
                                  value: "知道了",
                                  callback: function() {}
                                }
                              ]
                            });
                          } else if (that.data.statBind == 2) {
                            //statBind的状态值2表示解绑处理中
                            jumi.alert({
                              title: "提示",
                              content:
                                '<p class="textcenter">正在解绑中，请稍后操作</p>',
                              button: [
                                {
                                  value: "知道了",
                                  callback: function() {}
                                }
                              ]
                            });
                          } else if (
                            that.data.statBind == 4 ||
                            that.data.statBind == 8
                          ) {
                            //statBind的状态值4，8分别表示解绑失败和绑卡成功
                            location.href = "cashout.html" + location.search;
                          }
                        } else {
                          jumi.tips(data.msg);
                        }
                      } //success的结束
                    });
                  }
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
          }); //end vue
        }
      }
    });
  }); //isLogin的结束

  // 微信登陆--该链接后面不带参数
  var url = location.href.split("?code=")[0];
  var locationCodepar = location.href.split("?code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
