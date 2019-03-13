define(["jumi", "weixin", "getPara", "isLogin", "isLoginwx", "vue"], function(
  jumi,
  weixin,
  getPara,
  isLogin,
  isLoginwx,
  vue
) {
  var para = getPara.get();
  var token = localStorage.getItem("token");
  var preType = para.preType ? para.preType : 0; //页面类型0正常页面1预览页面

  var parainit = {
    preType: preType,
    token: token,
    activityId: para.action_id,
    requestSource: "WAP"
  };

  $.ajax({
    url: "/activity/getActivityDetailById",
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
              template: "#detailTemplate",
              data: function() {
                return {
                  data: data.data,

                  exchangeStr1:
                    '<div class="textcenter">聚小米提醒您，兑换成功！</div>',
                  exchangeStr2:
                    '<div class="textcenter"><p>聚小米提醒您，兑换成功！</p><p class="clr-gray">订单将在3个工作日内处理完毕！</p></div>',
                  exchangeStr3:
                    '<div class="textcenter"><p>聚小米提醒您，兑换成功！</p><p class="clr-gray">订单将在3个工作日内处理完毕！</p></div>',

                  lotteryStr1:
                    '<div class="textcenter">聚小米提醒您，抽奖成功！</div>',
                  lotteryStr2:
                    '<div class="textcenter"><p>聚小米提醒您，抽奖成功！</p><p class="clr-gray">订单将在3个工作日内处理完毕！</p></div>',
                  lotteryStr3:
                    '<div class="textcenter"><p>聚小米提醒您，抽奖成功！</p><p class="clr-gray">订单将在3个工作日内处理完毕！</p></div>',
                  lotteryStr4:
                    '<div class="textcenter"><p>聚小米提醒您，您没有中奖~</div>',

                  isIOSShow: localStorage.fromapp == "ios" //为IOS通过官方审核而用
                };
              },
              methods: {
                //兑换&&抽奖
                next: function() {
                  // tips：首先判断用户是否登录
                  var that = this;
                  isLogin(function() {
                    var paranext = {
                      token: token,
                      activityId: para.action_id,
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/needLogin/activity/checkDraw",
                      type: "post",
                      dataType: "json",
                      data: paranext,
                      success: function(data) {
                        // console.log(data);
                        //兑换
                        if (that.data.type == 3) {
                          if (data.code == "0000") {
                            that.data.useCoin =
                              that.data.useCoin - that.data.expendCoin; //实时改变聚米币的值
                            that.data.remainingNumber -= 1; //实时改变剩余数量
                            //维护订单（寄送订单-实物）
                            if (data.data.awardType == 4) {
                              jumi.alert({
                                title: "兑换",
                                content: that.exchangeStr3,
                                button: [
                                  {
                                    value: "维护订单",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/active/activeDetail.html?orderId=" +
                                        data.data.orderid;
                                    }
                                  }
                                ]
                              });
                            }
                            //确认订单(备注订单-虚拟物品)
                            if (data.data.awardType == 3) {
                              jumi.alert({
                                title: "兑换",
                                content: that.exchangeStr2,
                                button: [
                                  {
                                    value: "确认订单",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/active/activeDetail.html?orderId=" +
                                        data.data.orderid;
                                    }
                                  }
                                ]
                              });
                            }
                            //查看记录（现金，红包，聚米币）（无订单）
                            if (
                              data.data.awardType == 0 ||
                              data.data.awardType == 1 ||
                              data.data.awardType == 2
                            ) {
                              jumi.alert({
                                title: "兑换",
                                content: that.exchangeStr1,
                                button: [
                                  {
                                    value: "查看记录",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/active/activeRecord.html";
                                    }
                                  }
                                ]
                              });
                            }
                          } else {
                            jumi.tips(data.msg);
                          }
                        } //兑换 end

                        //抽奖
                        if (that.data.type == 2) {
                          if (data.code == "0000") {
                            that.data.useCoin =
                              that.data.useCoin - that.data.expendCoin; //实时改变聚米币的值
                            //维护订单（寄送订单-实物）
                            if (data.data.awardType == 4) {
                              that.data.remainingNumber -= 1; //实时改变剩余数量
                              jumi.alert({
                                title: "抽奖",
                                content: that.lotteryStr3,
                                button: [
                                  {
                                    value: "维护订单",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/active/activeDetail.html?orderId=" +
                                        data.data.orderid;
                                    }
                                  }
                                ]
                              });
                            }
                            //确认订单(备注订单-虚拟物品)
                            if (data.data.awardType == 3) {
                              that.data.remainingNumber -= 1; //实时改变剩余数量
                              jumi.alert({
                                title: "抽奖",
                                content: that.lotteryStr2,
                                button: [
                                  {
                                    value: "确认订单",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/active/activeDetail.html?orderId=" +
                                        data.data.orderid;
                                    }
                                  }
                                ]
                              });
                            }
                            //无订单（现金，红包，聚米币）（查看记录）
                            if (
                              data.data.awardType == 0 ||
                              data.data.awardType == 1 ||
                              data.data.awardType == 2
                            ) {
                              that.data.remainingNumber -= 1; //实时改变剩余数量
                              jumi.alert({
                                title: "抽奖",
                                content: that.lotteryStr1,
                                button: [
                                  {
                                    value: "查看记录",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/active/activeRecord.html";
                                    }
                                  }
                                ]
                              });
                            }
                            if (data.data.awardType == -1) {
                              jumi.alert({
                                title: "抽奖",
                                content: that.lotteryStr4,
                                button: [
                                  {
                                    value: "知道了",
                                    callback: function() {
                                      location.reload();
                                    }
                                  }
                                ]
                              });
                            }
                          } else {
                            jumi.tips(data.msg);
                          }
                        } //抽奖 end
                      } //success结束
                    });
                  });
                } //next结束
              } //methods结束
            } //my-detail模块结束
          }, //components结束
          ready: function() {
            $("#myloading").remove();
            var that = this;
            // console.log(that);
            var name = that.$children[0].data.name;

            var url = location.href.split("&code=")[0];
            var locationCodepar = location.href.split("&code=")[1];
            if (locationCodepar) {
              var locationCode = locationCodepar.split("&state=")[0];
              isLoginwx(locationCode, url);
            }

            //分享
            weixin
              .setTitle(name)
              .setDesc()
              .setImg()
              .setUrl(
                location.origin +
                  "/h5/views/topic/topicDetail.html?action_id=" +
                  para.action_id
              )
              .share();
          }
        });
      } //if结束
    } //success结束
  }); //ajax结束
});
