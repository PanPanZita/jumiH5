define([
  "jumi",
  "weixin",
  "getPara",
  "isLogin",
  "isLoginwx",
  "vue",
  "nav"
], function(jumi, weixin, getPara, isLogin, isLoginwx, vue, nav) {
  var token = localStorage.getItem("token"); //判断是否是新用户
  var shareUrl = location.href;
  var parainit = {
    itemId: 1,
    requestSource: "WAP"
  };
  $.ajax({
    url: "/item/getItemBasicInfo",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      console.log(data);
      if (data.code == "0000") {
        new vue({
          el: "body",
          components: {
            "my-item": {
              template: "#itemTemplate",
              data: function() {
                return {
                  data: data.data,
                  noviceStatus: data.data.noviceStatus //是否开启状态0:未开启；1：已开启
                };
              },
              filters: {
                tenthousand: function(value) {
                  if (value >= 10000) {
                    return value / 10000 + " 万元";
                  } else {
                    return value + " 元";
                  }
                },
                countFilter: function(count) {
                  var countz = new Number(count);
                  if (countz > 99) {
                    countz = "99+";
                  } else if (countz == 0) {
                    countz = "";
                  }
                  return countz;
                }
              },
              methods: {
                toLink: function() {
                  var that = this; //vue
                  // tips：首先判断用户是否登录
                  isLogin(function() {
                    var paratakein = {
                      gearId: 1,
                      token: token,
                      requestSource: "WAP"
                    };
                    //点击立即参与
                    $.ajax({
                      url: "/needLogin/buy/toSupportCheckNovice",
                      type: "post",
                      data: paratakein,
                      dataType: "json",
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          //判断是否老用户
                          if (!data.data.noviceUser) {
                            //true  新手  false 非新手
                            jumi.alert({
                              title: "提示",
                              content:
                                "聚小米提醒您：<br>您已经不是新人用户了哦~",
                              button: [
                                {
                                  value: "知道了"
                                }
                              ]
                            });
                            return;
                          } else if (!data.data.statAcct) {
                            //未开户
                            location.href =
                              "/h5/views/account/settings/bankcardToBind.html";
                            return;
                          } else if (!data.data.statBind) {
                            //(已开户)未绑定
                            location.href =
                              "/h5/views/account/settings/bankcardToBindAndCashout.html";
                            return;
                          } else if (data.data.costType == 1) {
                            //回报（权益型）
                            location.href =
                              "/h5/views/payment/investCart.html?itemid=1&gearId=1";
                          }
                        } else {
                          jumi.tips(data.msg);
                        }
                      }
                    });
                  });
                },
                addToWeixin: function() {
                  var codeStr = "";
                  var opration = "";
                  var weixinStr = "";

                  if (localStorage.fromapp == "ios") {
                    opration =
                      '<span class="clr-strike">微信扫描</span> 二维码，添加客服微信';
                  } else if (localStorage.fromapp == "android") {
                    opration =
                      '<span class="clr-strike">微信扫描</span> 二维码，添加客服微信';
                  } else {
                    opration =
                      '<span class="clr-strike">长按</span> 识别二维码，添加客服微信';
                  }

                  if (data.data.wxImagePath) {
                    codeStr =
                      "" +
                      "	<p>" +
                      opration +
                      "</p>" +
                      '	<p><img src="' +
                      data.data.wxImagePath +
                      '" alt="" style="width:auto;height:15rem;margin:0 auto;"></p>';
                  } else {
                    codeStr = "<p>暂无讨论群，请随时关注！</p>";
                  }
                  weixinStr =
                    '<div style="text-align:center;">' + codeStr + "</div>";

                  jumi.alert({
                    title: "客服二维码",
                    content: weixinStr,
                    button: false
                  });
                }
              }
            }
          },
          ready: function() {
            var that = this;
            $("#myloading").remove();
            // console.log(that);   //如果没有和components同级，和methods同级，打印出来的this是指vue...
            // console.log(data);

            //   微信登陆--该链接后面不带参数
            var url = location.href.split("?code=")[0];
            var locationCodepar = location.href.split("?code=")[1];
            if (locationCodepar) {
              var locationCode = locationCodepar.split("&state=")[0];
              isLoginwx(locationCode, url);
            }

            if (that.$children[0].noviceStatus == 0) {
              nav.setActiveNav("account");
            }

            var intervalId = 0;
            if (
              that.$children[0].data.investPhoneList &&
              that.$children[0].data.investPhoneList.length > 1
            ) {
              intervalId = setInterval(function() {
                var liFirst = $("#slider li:first");
                var liSecond = $("#slider li").eq(1);
                var liLast = $("#slider li:last");
                liFirst.animate({ opacity: 0 }, 1000, function() {
                  liFirst.insertAfter(liLast);
                  liSecond.animate({ opacity: 1 }, 1000);
                });
              }, 3000);
            }

            if (localStorage.fromapp == "ios") {
              var o = {
                title: that.$children[0].data.shareTitle,
                desc: that.$children[0].data.shareContent,
                img: that.$children[0].data.sharePic,
                url: shareUrl
              };
              window.webkit.messageHandlers.share.postMessage(o);
            } else if (localStorage.fromapp == "android") {
              var o = {
                title: that.$children[0].data.shareTitle,
                desc: that.$children[0].data.shareContent,
                img: that.$children[0].data.sharePic,
                url: shareUrl
              };
              window.Android.callAndroidAction("0", JSON.stringify(o));
            } else {
              weixin
                .setTitle(that.$children[0].data.shareTitle)
                .setDesc(that.$children[0].data.shareContent)
                .setImg(that.$children[0].data.sharePic)
                .setUrl(shareUrl)
                .share(true);
            }
          }
        });
      }
    }
  });
});
