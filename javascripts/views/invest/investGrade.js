define([
  "jumi",
  "nav",
  "asyncload",
  "getPara",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin"
], function(jumi, nav, asyncload, getPara, isLogin, isLoginwx, vue, weixin) {
  var para = getPara.get();
  var itemId = para.itemid;
  var token = localStorage.getItem("token"); //判断是否是新用户
  var preType = para.preType ? para.preType : 0;
  var parainit = {
    preType: preType, //页面类型0正常页面1预览页面
    itemId: itemId,
    token: token,
    requestSource: "WAP"
  };
  $.ajax({
    url: "/item/getItemGearList",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      // console.log(data);
      if (data.code == "0000") {
        new vue({
          el: "body",
          components: {
            "my-grade": {
              template: "#gradeTemplate",
              data: function() {
                return {
                  data: data.data,
                  gearList: data.data.gearList
                };
              },
              methods: {
                toLink: function(itemid, id, money, levelName) {
                  // tips：首先判断用户是否登录
                  isLogin(function() {
                    var paraclick = {
                      requestSource: "WAP",
                      token: token,
                      gearId: id
                    };
                    // console.log(paraclick);
                    $.ajax({
                      url: "/needLogin/buy/toSupportCheck",
                      type: "post",
                      dataType: "json",
                      data: paraclick,
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          if (data.data.costType == 0) {
                            //不回报-实物型
                            location.href =
                              "/h5/views/payment/investCartweixin.html?itemid=" +
                              itemid +
                              "&gearId=" +
                              id;
                          } else if (data.data.costType == 1) {
                            // statAcct  0:未开户 1:处理中，8：开户成功，9：开户失败
                            // realStatus  0:未实名，1：已实名
                            //回报-权益型
                            if (data.data.realStatus == 0) {
                              //未开户
                              jumi.alert({
                                skin: "ui-dialog-bankcard",
                                content: "您尚未开户，请先开户",
                                button: [
                                  {
                                    value: "取消"
                                  },
                                  {
                                    value: "立即开户",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/settings/bankcardToBind.html?redirectURL=/h5/views/invest/investGrade.html?itemid=" +
                                        itemid;
                                    }
                                  }
                                ]
                              });
                              return false;
                            }
                            location.href =
                              "/h5/views/payment/investCart.html?itemid=" +
                              itemid +
                              "&gearId=" +
                              id;
                          }
                        } else {
                          //data.code结束
                          jumi.tips(data.msg);
                        }
                      } //success结束
                    }); //ajax结束
                  });
                } //toLink结束
              }
            },
            "my-explain": {
              template: "#explainTemplate",
              data: function() {
                return {
                  data: data.data
                };
              },
              filters: {
                moneyStr: function(targetAmount) {
                  targetAmount = targetAmount.toString().replace(/\$|\,/g, "");
                  for (
                    var i = 0;
                    i < Math.floor((targetAmount.length - (1 + i)) / 3);
                    i++
                  )
                    targetAmount =
                      targetAmount.substring(
                        0,
                        targetAmount.length - (4 * i + 3)
                      ) +
                      "," +
                      targetAmount.substring(targetAmount.length - (4 * i + 3));
                  return targetAmount;
                }
              }
            }
          },
          ready: function() {
            nav.setActiveNav("index");
            $(".async").asyncload();
            $("#myloading").remove();

            var url = location.href.split("&code=")[0];
            var locationCodepar = location.href.split("&code=")[1];
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
});
