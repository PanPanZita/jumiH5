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
      url: "/userCenter/userAccount/getBankHistory",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-backlist": {
                template: "#backlistTemplate",
                data: function() {
                  return {
                    data: data.data,
                    bankHistories: data.data.bankHistories,
                    jmOnlineBanks: data.data.jmOnlineBanks
                  };
                },
                methods: {
                  supportBankcard: function() {
                    jumi.alert({
                      title: "支持绑定的银行卡",
                      content: document.getElementById("bankcardListBox"),
                      button: false
                    });
                  },
                  addBankcard: function() {
                    location.href =
                      "/h5/views/account/settings/bankcardToBindAndCashout.html";
                  },
                  delBank: function(id) {
                    jumi.alert({
                      skin: "ui-dialog-bankcard",
                      title: "提示",
                      content: "确定删除该条银行卡记录吗？",
                      button: [
                        {
                          value: "取消",
                          callback: function() {}
                        },
                        {
                          value: "确认",
                          callback: function() {
                            var paradel = {
                              id: id,
                              token: token,
                              requestSource: "WAP"
                            };
                            $.ajax({
                              url: "/userCenter/userAccount/deleteBankCard",
                              type: "post",
                              dataType: "json",
                              data: paradel,
                              success: function(data) {
                                // console.log(data);
                                if (data.code == "0000") {
                                  jumi.tips("成功删除该条银行卡记录~");
                                  location.reload();
                                } else {
                                  jumi.tips(data.msg);
                                }
                              }
                            });
                          }
                        }
                      ]
                    });
                  },
                  bindBank: function(bankcard) {
                    var that = this;
                    //传递的数据
                    var paranext = {
                      bankCardId: bankcard,
                      token: token,
                      requestSource: "WAP"
                    };
                    jumi.alert({
                      title: "提示",
                      content:
                        "<p>1、实名认证是验证您所绑定的银行账户是否属于您本人，确保您的资金安全，账户中的资金只能被提现到您本人的银行卡中。</p><p>2、您在绑定银行卡的过程中，为了确保您与第三方监管平台已成功建立资金保障关系，会向您的聚米账户充值1元，充值金额您可正常使用，请您放心！</p>",
                      button: [
                        {
                          value: "知道了",
                          callback: function() {
                            $.ajax({
                              url: "/userCenter/userAccount/bindCard",
                              type: "post",
                              dataType: "json",
                              data: paranext,
                              success: function(data) {
                                // console.log(data);
                                if (data.code == "0000") {
                                  $("#payForm").attr(
                                    "action",
                                    data.data.rechargeUrl
                                  );
                                  $("#req_data").val(data.data.reqData);
                                  document.getElementById("payForm").submit();
                                } else {
                                  jumi.tips(data.msg);
                                }
                              }
                            });
                          }
                        }
                      ]
                    });
                  }
                },
                filters: {
                  fourBankcard: function(str) {
                    return str.substr(str.length - 4, 4);
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
          });
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
