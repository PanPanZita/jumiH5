define(["jumi", "vue", "getPara", "isLogin", "isLoginwx", "weixin"], function(
  jumi,
  vue,
  getPara,
  isLogin,
  isLoginwx,
  weixin
) {
  var para = getPara.get();
  var isNoviceUser = para.isNoviceUser; //0是新手1是非新手
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    if (isNoviceUser == 0) {
      new vue({
        el: "body",
        components: {
          "my-detail": {
            template: "#investDetailTemplate",
            data: function() {
              return {
                isNoviceUser: isNoviceUser
              };
            }
          }
        },
        ready: function() {
          $("#myloading").remove();
        }
      });
    } else if (isNoviceUser == 1) {
      $.ajax({
        url: "/userCenter/investBill/getNoviceInvestBillDetail",
        type: "post",
        dataType: "json",
        data: parainit,
        success: function(data) {
          // console.log(data);
          if (data.code == "0000") {
            new vue({
              el: "body",
              components: {
                "my-detail": {
                  template: "#investDetailTemplate",
                  data: function() {
                    return {
                      data: data.data,
                      isNoviceUser: isNoviceUser
                    };
                  },
                  methods: {
                    //回报内容
                    showInfo: function() {
                      var that = this;
                      jumi.alert({
                        title: "回报内容",
                        content: that.data.returnContent,
                        button: false
                      });
                    }, //end showInfo
                    //确认收货
                    ok: function(id) {
                      var that = this;
                      var paraok = {
                        investBillId: id,
                        requestSource: "WAP",
                        token: token
                      };
                      jumi.alert({
                        skin: "ui-dialog-bankcard",
                        content: "聚小米提醒您，确认收货后订单交易完成。",
                        button: [
                          {
                            value: "取消"
                          },
                          {
                            value: "确认收货",
                            callback: function() {
                              $.ajax({
                                url: "/userCenter/investBill/confirmReceipt",
                                type: "post",
                                dataType: "json",
                                data: paraok,
                                success: function(data) {
                                  // console.log(data);
                                  if (data.code == "0000") {
                                    // that.data = data;
                                  } else {
                                    jumi.tips("确认收货失败！");
                                  }
                                }
                              });
                            }
                          }
                        ]
                      });
                    } //end ok
                  }
                }
              },
              ready: function() {
                var that = this;
                $("#myloading").remove();
                // console.log(that);

                if (localStorage.fromapp == "ios") {
                  var o = {
                    title: that.$children[0].data.shareTitle,
                    desc: that.$children[0].data.shareContent,
                    img: that.$children[0].data.sharePic,
                    url: that.$children[0].data.shareUrl
                  };
                  window.webkit.messageHandlers.share.postMessage(o);
                } else if (localStorage.fromapp == "android") {
                  var o = {
                    title: that.$children[0].data.shareTitle,
                    desc: that.$children[0].data.shareContent,
                    img: that.$children[0].data.sharePic,
                    url: that.$children[0].data.shareUrl
                  };
                  window.Android.callAndroidAction("0", JSON.stringify(o));
                } else {
                  weixin
                    .setTitle(that.$children[0].data.shareTitle)
                    .setDesc(that.$children[0].data.shareContent)
                    .setImg(that.$children[0].data.sharePic)
                    .setUrl(that.$children[0].data.shareUrl)
                    .share();
                }
              }
            });
          }
        }
      });
    }
  }); //isLogin的结束
  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
