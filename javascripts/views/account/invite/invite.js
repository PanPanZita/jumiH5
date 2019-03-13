define([
  "vue",
  "asyncload",
  "weixin",
  "slidefocus",
  "isLogin",
  "isLoginwx",
  "jumi",
  "DateFormat",
  "wxBackbtn"
], function(
  vue,
  asyncload,
  weixin,
  slidefocus,
  isLogin,
  isLoginwx,
  jumi,
  DateFormat,
  wxBackbtn
) {
  //   alert("1/5/9" + location.href);
  var token = localStorage.getItem("token");
  //   微信登陆--该链接后面不带参数，在这个分开写的意义是：isLogin与isLoginwx方法可能会同时进行，导致页面一直转转转，所以分开写。
  var url = location.href.split("?code=")[0];
  var locationCodepar = location.href.split("?code=")[1];
  //有值的话证明，刚进入到页面时时未登陆的，随后去授权了。然后回到该页面，isLogin的方法已经去执行了
  //无值代表：未登陆时刚进入该页面还未授权登录，或者已经是登陆状态了

  var parainit = {
    token: token,
    requestSource: "WAP"
  };

  //   微信登陆--该链接后面不带参数
  if (!locationCodepar) {
    isLogin(function() {
      $.ajax({
        type: "get",
        url: "/userCenter/inviteFriend/getHomePageData",
        dataType: "json",
        data: parainit,
        success: function(data) {
          // console.log(data);
          if (data.code == "0000") {
            if (data.data != null) {
              if (data.data.jumpState == 1) {
                //邀请好友
                $("#inviteBox").removeClass("hiddenImportant");
                $("#financeBox").addClass("hiddenImportant");
                $("title").text("邀请好友-聚米众筹");
                $("body").css({
                  background: "#fff"
                });
                $("html").css({
                  background: "#fff"
                });
                var data = data.data;
                new vue({
                  el: "body",
                  components: {
                    //邀请好友
                    "my-invite": {
                      template: "#inviteTemplate",
                      data: function() {
                        return {
                          data: data,
                          //邀请好友还是理财经理：1=邀请好友页面，2=理财经理页面
                          jumpState: data.jumpState,
                          //分享相关
                          shareContent: data.shareContent,
                          sharePic: data.sharePic,
                          shareTitle: data.shareTitle,
                          shareUrl: data.shareUrl,
                          //邀请好友
                          breakExplain: data.inviFriHomePageData.breakExplain, //邀请好友互动中止说明
                          cashGearList: data.inviFriHomePageData.cashGearList, //现金奖励档位列表[object]
                          cashTaskBrief: data.inviFriHomePageData.cashTaskBrief, //现金任务简介
                          curPerCashReward:
                            data.inviFriHomePageData.curPerCashReward, //本期现金奖励
                          curPerHbReward:
                            data.inviFriHomePageData.curPerHbReward, //本期红包奖励
                          finActStatus: data.inviFriHomePageData.finActStatus, //理财经理活动状态：0=活动中，1=中止
                          finManagerBannerUrl:
                            data.inviFriHomePageData.finManagerBannerUrl, //理财经理banner图跳转链接
                          finPreperAssessState:
                            data.inviFriHomePageData.finPreperAssessState, //理财经理上期考核状态：0=不是理财经理，1=考核中，2=考核失败
                          finRuleBrief: data.inviFriHomePageData.finRuleBrief, //理财经理规则简介
                          finRuleId: data.inviFriHomePageData.finRuleId, //理财经理规则ID
                          firInvestNum: data.inviFriHomePageData.firInvestNum, //邀请首投人数
                          hasUpgradeFinManager:
                            data.inviFriHomePageData.hasUpgradeFinManager, //是否可以升级为理财经理：0=不可升级，1=可以升级
                          hongbaoGearList:
                            data.inviFriHomePageData.hongbaoGearList, //红包奖励档位列表[object]
                          hongbaoTaskBrief:
                            data.inviFriHomePageData.hongbaoTaskBrief, //红包任务简介
                          investAmount: data.inviFriHomePageData.investAmount, //邀请用户投资总额
                          inviActStatus: data.inviFriHomePageData.inviActStatus, //邀请好友活动状态：1=活动预告，2=活动中，3=活动结束，4=活动中止，5=无活动
                          inviFriBannerUrl:
                            data.inviFriHomePageData.inviFriBannerUrl, //邀请好友banner图跳转链接
                          inviRuleId: data.inviFriHomePageData.inviRuleId, //邀请好友规则ID
                          regiterNum: data.inviFriHomePageData.regiterNum, //邀请注册人数
                          rewardType: data.inviFriHomePageData.rewardType, //奖励类型：0=红包，1=现金，2=红包与现金
                          startTime: data.inviFriHomePageData.startTime, //活动开始时间，时间戳格式
                          endTime: data.inviFriHomePageData.endTime, //活动结束时间，时间戳格式
                          totalCashReward:
                            data.inviFriHomePageData.totalCashReward, //累计现金奖励
                          totalHbReward: data.inviFriHomePageData.totalHbReward, //累计红包奖励
                          //自定义参数
                          isShare: false,
                          days: "00",
                          hours: "00",
                          minutes: "00",
                          seconds: "00",
                          count: 0, //剩余时间，(Date.now() - 1494223237966)
                          startcount: 0, //(data.startTime - Date.now().toString().substr(0,10))
                          endcount: 0, //(data.endTime - Date.now().toString().substr(0, 10))
                          interval: null,
                          commonStart: 0,
                          commonEnd: 0
                        };
                      },
                      //data ends
                      compiled: function() {
                        //转换时间戳
                        //   李氏写法start
                        //   var normalStart =
                        //     this.startTime.toString().substr(0, 13) - 0;
                        //   var normalEnd = this.endTime.toString().substr(0, 13) - 0;
                        //   var commonStart = new Date(normalStart)
                        //     .toLocaleString()
                        //     .substr(0, 10);
                        //   var commonEnd = new Date(normalEnd)
                        //     .toLocaleString()
                        //     .substr(0, 10);
                        //   李氏写法end
                        this.commonStart = new Date(this.startTime).Format(
                          "yyyy-MM-dd"
                        );
                        this.commonEnd = new Date(this.endTime).Format(
                          "yyyy-MM-dd"
                        );
                        //当前时间
                        var timestamp = Date.parse(new Date());
                        this.startcount = this.startTime - timestamp;
                        this.endcount = this.endTime - timestamp;
                        if (this.inviActStatus == "1") {
                          //活动预告
                          this.count = this.startcount;
                          this.countdown();
                        } else if (this.inviActStatus == "2") {
                          //活动中
                          this.count = this.endcount;
                          this.countdown();
                        }
                      },
                      //compiled ends
                      methods: {
                        show: function() {
                          this.isShare = true;
                        },
                        hide: function() {
                          this.isShare = false;
                        },
                        gearGet: function(gearid, type, money, index) {
                          //红包或者现金根据档位id领取
                          var that = this;
                          var para = {
                            gearId: gearid,
                            token: token,
                            requestSource: "WAP",
                            ruleId: that.inviRuleId
                          };
                          $.ajax({
                            type: "get",
                            url: "/userCenter/inviteFriend/receiveGearReward",
                            data: para,
                            dataType: "json",
                            success: function(geardata) {
                              if (geardata.code == "0000") {
                                var isRealname = geardata.data.realStatus; //0：未实名；1：已实名
                                if (isRealname == 1) {
                                  if (type == "0") {
                                    //红包
                                    that.curPerHbReward =
                                      that.curPerHbReward + money;
                                    that.totalHbReward =
                                      that.totalHbReward + money;
                                    that.hongbaoGearList[
                                      index
                                    ].hasAlreadyReceive = 1;
                                  } else if (type == "1") {
                                    //现金
                                    that.curPerCashReward =
                                      that.curPerCashReward + money;
                                    that.totalCashReward =
                                      that.totalCashReward + money;
                                    that.cashGearList[
                                      index
                                    ].hasAlreadyReceive = 1;
                                  }
                                  if (geardata.data.hasUpFinManager == 1) {
                                    that.hasUpgradeFinManager = 1;
                                  } else if (
                                    geardata.data.hasUpFinManager == 2
                                  ) {
                                    that.hasUpgradeFinManager = 0;
                                  }
                                } else {
                                  jumi.alert({
                                    title: "提示",
                                    content: "您还未开户，是否去开户？",
                                    button: [
                                      {
                                        value: "去开户",
                                        callback: function() {
                                          location.href =
                                            "/h5/views/account/settings/bankcardToBind.html"; //哥得跳转到实名认证页去，谁都阻止不了我
                                        }
                                      }
                                    ]
                                  });
                                }
                              } else {
                                var errorMsg = geardata.msg;
                                jumi.alert({
                                  title: "提示",
                                  content: errorMsg,
                                  button: [
                                    {
                                      value: "知道了"
                                    }
                                  ]
                                });
                              }
                            }
                          });
                        },
                        //升级为理财经理
                        //   upgrade: function() {
                        //     $.ajax({
                        //       type: "get",
                        //       url:
                        //         "/userCenter/financialManager/upgradeFinancialManager",
                        //       data: parainit,
                        //       dataType: "json",
                        //       success: function(geardata) {
                        //         if (geardata.code == "0000") {
                        //           jumi.alert({
                        //             content: document.getElementById(
                        //               "upgrade-success"
                        //             ),
                        //             button: [
                        //               {
                        //                 value: "知道了",
                        //                 callback: function() {
                        //                   location.href =
                        //                     "/h5/views/account/invite/invite.html";
                        //                 }
                        //               }
                        //             ]
                        //           });
                        //         } else {
                        //           jumi.alert({
                        //             content: geardata.msg,
                        //             button: [
                        //               {
                        //                 value: "知道了",
                        //                 callback: function() {}
                        //               }
                        //             ]
                        //           });
                        //         }
                        //       }
                        //     });
                        //   },
                        unGet: function() {
                          $(".un-get").css({
                            display: "none"
                          });
                        },
                        update: function() {
                          this.count = this.count - 1000;
                          if (this.count <= 0) {
                            this.seconds = "00";
                            clearInterval(this.interval);
                            if (this.inviActStatus == 1) {
                              this.inviActStatus = 2;
                            } else if (this.inviActStatus == 2) {
                              this.inviActStatus = 3;
                            }
                            return;
                          }

                          /*李氏错误写法
                            var n = this.count % (365 * 24 * 60 * 60 * 1000);
                            console.log(n);
                            this.days = parseInt(n / (24 * 60 * 60 * 1000)) + "";
                            console.log(days);
                            if (this.days < 10) {
                              this.days = "0" + this.days;
                            }

                            var n1 = n % (24 * 60 * 60 * 1000);
                            this.hours = parseInt(n1 / (60 * 60 * 1000)) + "";
                            if (this.hours < 10) {
                              this.hours = "0" + this.hours;
                            }

                            var n2 = n1 % (60 * 60 * 1000);
                            this.minutes = parseInt(n2 / (60 * 1000)) + "";
                            if (this.minutes < 10) {
                              this.minutes = "0" + this.minutes;
                            }

                            var n3 = n2 % (60 * 1000);
                            this.seconds = parseInt(n3 / 1000) + "";
                            if (this.seconds < 10) {
                              this.seconds = "0" + this.seconds;
                            }**/
                          var n = this.count % (24 * 60 * 60 * 1000);
                          this.days =
                            parseInt(this.count / (24 * 60 * 60 * 1000)) + "";
                          if (this.days < 10) {
                            this.days = "0" + this.days;
                          }

                          var n1 = n % (60 * 60 * 1000);
                          this.hours = parseInt(n / (60 * 60 * 1000)) + "";
                          if (this.hours < 10) {
                            this.hours = "0" + this.hours;
                          }

                          var n2 = n1 % (60 * 1000);
                          this.minutes = parseInt(n1 / (60 * 1000)) + "";
                          if (this.minutes < 10) {
                            this.minutes = "0" + this.minutes;
                          }

                          var n3 = n2 % (60 * 1000);
                          this.seconds = parseInt(n2 / 1000) + "";
                          if (this.seconds < 10) {
                            this.seconds = "0" + this.seconds;
                          }
                        },
                        countdown: function() {
                          this.interval = setInterval(this.update, 1000);
                        }
                      }
                      //methods ends
                    }
                    //邀请好友 ends
                  },
                  //components ends
                  ready: function() {
                    slidefocus.init({
                      id: "#slider"
                    });

                    $("#myloading").remove();
                    var that = this;
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
                  //ready ends
                });
                //vue ends
              } else {
                //理财经理
                $("#inviteBox").addClass("hiddenImportant");
                $("#financeBox").removeClass("hiddenImportant");
                $("title").text("理财经理-聚米众筹");
                $("body").css({
                  background: "#fff1BF"
                });
                $("html").css({
                  background: "#fff"
                });
                var data = data.data;
                new vue({
                  el: "body",
                  components: {
                    //理财经理
                    "my-finance": {
                      template: "#financeTemplate",
                      data: function() {
                        return {
                          data: data,
                          //邀请好友还是理财经理：1=邀请好友页面，2=理财经理页面
                          jumpState: data.jumpState,
                          //分享相关
                          shareContent: data.shareContent,
                          sharePic: data.sharePic,
                          shareTitle: data.shareTitle,
                          shareUrl: data.shareUrl,
                          //理财经理
                          activityStatus:
                            data.finManagerHomePageData.activityStatus, //理财经理活动状态：0=活动中，1=中止
                          assmentAmount:
                            data.finManagerHomePageData.assmentAmount, //考核需满足金额
                          assmentId: data.finManagerHomePageData.assmentId, //考核期数ID
                          assmentStatus:
                            data.finManagerHomePageData.assmentStatus, //考核状态：0=考核中，1=考核通过，2=考核失败
                          breakExplain:
                            data.finManagerHomePageData.breakExplain, //理财经理活动中止说明
                          curNoPayCommission:
                            data.finManagerHomePageData.curNoPayCommission, //本期待结算佣金
                          curPayCommission:
                            data.finManagerHomePageData.curPayCommission, //本期已结算佣金
                          finManagerBannerUrl:
                            data.finManagerHomePageData.finManagerBannerUrl, //理财经理Banner图跳转链接
                          hasOutOfDate:
                            data.finManagerHomePageData.hasOutOfDate, //理财经理考核是否过期：0=未过期，1=已过期
                          hasReachTarget:
                            data.finManagerHomePageData.hasReachTarget, //是否达标：0=未达标，1=已达标
                          investAmount:
                            data.finManagerHomePageData.investAmount, //本期好友投资总额
                          proBarAmount:
                            data.finManagerHomePageData.proBarAmount, //进度条金额
                          startTime: data.finManagerHomePageData.startTime, //考核期开始时间，yyyy-MM-dd形式
                          endTime: data.finManagerHomePageData.endTime, //考核期结束时间，yyyy-MM-dd形式
                          totalNoPayCommission:
                            data.finManagerHomePageData.totalNoPayCommission, //累计待结算佣金
                          totalPayCommission:
                            data.finManagerHomePageData.totalPayCommission, //累计已结算佣金
                          //自定义参数
                          isShare: false,
                          days: "00",
                          hours: "00",
                          minutes: "00",
                          seconds: "00",
                          count: 0, //(Date.now() - 1494223237966), //剩余时间
                          startcount: 0, //(data.startTime - Date.now().toString().substr(0,10)),
                          endcount: 0, //(data.endTime - Date.now().toString().substr(0, 10)),
                          interval: null
                        };
                      }, //data ends
                      compiled: function() {}, //compiled ends
                      methods: {
                        show: function() {
                          this.isShare = true;
                        },
                        hide: function() {
                          this.isShare = false;
                        },
                        test: function() {
                          jumi.alert({
                            content: document.getElementById("upgrade-success"),
                            button: [
                              {
                                value: "知道了"
                              }
                            ]
                          });
                        },
                        unGet: function() {
                          $(".un-get").css({
                            display: "none"
                          });
                          $(".has-get").css({
                            display: "none"
                          });
                        }
                      }
                      //methods ends
                    }
                    //理财经理 ends
                  },
                  //components ends
                  ready: function() {
                    slidefocus.init({
                      id: "#slider"
                    });

                    $("#myloading").remove();
                    var that = this;
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
                  //ready ends
                });
                //vue ends
              }
              //if-else ends
            }
          } else {
            jumi.tips(data.msg);
          }
        }
        //success ends
      });
      //ajax ends
    }); //isLogin的结束
  } else {
    // alert("6.准备进入到isLoginwx这个方法");
    var locationCode = locationCodepar.split("&state=")[0];
    //一定要保证这个url是最纯正的
    isLoginwx(locationCode, url);
  }
  var referrer = document.referrer; //返回上一个页面的页面地址
  var urlSource = referrer.split(".jumizc.com")[1];
  //   tips：该页面一共3个来源页面，如果来源操作是banner或者首页按钮的邀请好友，那么就返回到首页
  if (urlSource != "/h5/views/account/account.html") {
    wxBackbtn.setReturnUrl(); //控制微信浏览器的返回按钮
  }
});
//define ends
