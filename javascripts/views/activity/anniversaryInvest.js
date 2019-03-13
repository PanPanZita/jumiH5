define(["jquery", "vue", "jumi", "weixin"], function($, vue, jumi, weixin) {
  $.ajax({
    url: "/activity/convertibility",
    type: "post",
    dataType: "json",
    success: function(data) {
      // console.log(data);
      new vue({
        el: "body",
        components: {
          "my-anniversary": {
            template: "#anniversaryTemplate",
            data: function() {
              return {
                data: data,
                receiver: "",
                phone: "",
                address: ""
              };
            },
            methods: {
              isLogin: function(callback) {
                if (!this.data.is_login) {
                  isLogin();
                } else {
                  callback();
                }
              },
              //普通兑换
              toLink: function(price, upgrade) {
                var that = this;
                this.isLogin(function() {
                  $.ajax({
                    url: "/activity/willconvert",
                    data: {
                      price: price,
                      upgrade: upgrade
                    },
                    dataType: "json",
                    type: "post",
                    success: function(data) {
                      // console.log(data);
                      //符合条件
                      if (data.eligible) {
                        jumi.alert({
                          skin: "ui-dialog-bankcard",
                          title: "是否确认兑换该奖品？",
                          content: document.getElementById("message"),
                          button: [
                            {
                              value: "取消"
                            },
                            {
                              value: "提交",
                              callback: function() {
                                var params = {
                                  price: price,
                                  upgrade: upgrade,
                                  receiver: that.receiver,
                                  phone: that.phone,
                                  address: that.address
                                };
                                $.ajax({
                                  url: "/activity/convert",
                                  type: "post",
                                  dataType: "json",
                                  data: params,
                                  success: function(data) {
                                    // console.log(data);
                                    if (data.result) {
                                      //清空表单
                                      that.receiver = "";
                                      that.phone = "";
                                      that.address = "";
                                      jumi.tips("兑换成功~");
                                    } else {
                                      jumi.tips(data.message);
                                    }
                                  }
                                });
                              }
                            }
                          ]
                        });
                        return;
                      }
                      //不符合条件分两种
                      else {
                        //已兑换过
                        if (data.is_convert) {
                          jumi.alert({
                            title: "提示",
                            content:
                              "您已参与过兑换活动，已成功兑换了【" +
                              data.product +
                              "】；具体活动动态请关注官方通知。"
                          });
                        } else {
                          jumi.alert({
                            title: "提示",
                            content: "您尚未达到该奖励的兑换条件。"
                          });
                        }
                      }
                    }
                  });
                });
              },
              //升级兑换
              toLinkUpgrade: function(price, upgrade) {
                var that = this;
                this.isLogin(function() {
                  $.ajax({
                    url: "/activity/willconvert",
                    data: {
                      price: price,
                      upgrade: upgrade
                    },
                    dataType: "json",
                    type: "post",
                    success: function(data) {
                      // console.log(data);
                      //符合条件
                      if (data.eligible) {
                        jumi.alert({
                          skin: "ui-dialog-bankcard",
                          title: "是否确认兑换该奖品？",
                          content: document.getElementById("message"),
                          button: [
                            {
                              value: "取消"
                            },
                            {
                              value: "提交",
                              callback: function() {
                                var params = {
                                  price: price,
                                  upgrade: upgrade,
                                  receiver: that.receiver,
                                  phone: that.phone,
                                  address: that.address
                                };
                                $.ajax({
                                  url: "/activity/convert",
                                  type: "post",
                                  dataType: "json",
                                  data: params,
                                  success: function(data) {
                                    // console.log(data);
                                    if (data.result) {
                                      //清空表单
                                      that.receiver = "";
                                      that.phone = "";
                                      that.address = "";
                                      jumi.tips("兑换成功~");
                                    } else {
                                      jumi.tips(data.message);
                                    }
                                  }
                                });
                              }
                            }
                          ]
                        });
                        return;
                      }
                      //不符合条件分两种
                      else {
                        //已兑换过
                        if (data.is_convert) {
                          jumi.alert({
                            title: "提示",
                            content:
                              "您已参与过兑换活动，已成功兑换了【" +
                              data.product +
                              "】；具体活动动态请关注官方通知。"
                          });
                        } else {
                          jumi.alert({
                            skin: "ui-dialog-bankcard",
                            title: "提示",
                            content:
                              "在【2017年4月30日】前，投资满【" +
                              data.price +
                              "元】，邀请【" +
                              data.user_count +
                              "】位好友并且每位好友累计投资达到10000元，即可完成升级兑换！是否立即邀请？",
                            button: [
                              {
                                value: "取消"
                              },
                              {
                                value: "立即邀请",
                                callback: function() {
                                  location.href =
                                    "/h5/views/account/invite/invite.html";
                                }
                              }
                            ]
                          });
                        }
                      }
                    }
                  });
                });
              },
              receiverKeyup: function() {
                if (this.receiver.length > 12) {
                  this.receiver = this.receiver.substring(0, 12);
                }
              },
              phoneKeyup: function() {
                if (this.phone.length > 11) {
                  this.phone = this.phone.substring(0, 11);
                }
              },
              addressKeyup: function() {
                if (this.address.length > 120) {
                  this.address = this.address.substring(0, 120);
                }
              }
            }
          }
        },
        ready: function() {
          $("#myloading").remove();

          var o = {
            title: "聚米两周年庆！史上最大力度活动来袭！",
            desc:
              "黄金条，液晶电视，无人机...超多壕礼等你来拿，转盘100%中奖！更有价值6188元大奖送给你！",
            img:
              "https://jumifinance.oss-cn-hangzhou.aliyuncs.com/investdetail/1491361901378054729.jpg",
            url: "jumizc.com/h5/views/activity/anniversaryInvest.html"
          };
          if (localStorage.fromapp == "ios") {
            var a = decodeURIComponent(location.href.split("#")[0]);
            a = a.split(".")[0];
            a = a.split("//")[1];
            var b = "https://" + a + ".";
            o.url = b + o.url;

            window.webkit.messageHandlers.share.postMessage(o);
          } else if (localStorage.fromapp == "android") {
            var a = decodeURIComponent(location.href.split("#")[0]);
            a = a.split(".")[0];
            a = a.split("//")[1];
            var b = "https://" + a + ".";
            o.url = b + o.url;

            window.Android.callAndroidAction("0", JSON.stringify(o));
          } else {
            weixin
              .setTitle(o.title)
              .setDesc(o.desc)
              .setImg(o.img)
              .setUrl(o.url)
              .share(true);
          }
        }
      });
    }
  });
});
