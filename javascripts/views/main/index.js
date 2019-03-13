define([
  "jumi",
  "nav",
  "slidefocus",
  "scrolltotop",
  "asyncload",
  "weixin",
  "vue",
  "isLogin",
  "isLoginwx",
  "appSpread",
  "numberboard",
  "getPara",
  "md5"
], function(
  jumi,
  nav,
  slidefocus,
  scrolltotop,
  asyncload,
  weixin,
  vue,
  isLogin,
  isLoginwx,
  appSpread,
  numberboard,
  getPara,
  md5
) {
  var para = getPara.get();
  if (para.from) {
    // 是分享出来的链接,
    var locationCodepar = location.href.split("&code=")[1];
  } else {
    var locationCodepar = location.href.split("?code=")[1];
  }
  var token = localStorage.getItem("token"); //判断是否是新用户
  var parainit = {
    bannerNumber: 5,
    noticeNumber: 5,
    repaymentItemNumber: 2,
    successItemNumber: 2,
    stickItemNumber: 999, //推荐项目个数
    token: token,
    requestSource: "WAP"
  };

  $.ajax({
    url: "/homePage/getHomePageInfo",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      // console.log(data);
      if (data.code === "0000") {
        new vue({
          el: "body",
          components: {
            "my-index": {
              template: "#indexTemplate",
              data: function() {
                return {
                  data: data,
                  imgs: data.data.bannerList,
                  notices: data.data.noticeList,
                  lists: data.data.stickItemList,
                  successItemList: data.data.successItemList,
                  repaymentItemList: data.data.repaymentItemList,
                  userpwdreal: "",
                  userconfirmpwdreal: ""
                };
              },
              computed: {
                //改造data.data.noticeList。。
                noticesNew: function() {
                  var that = this;
                  for (var i = 0; i < that.notices.length; i++) {
                    var inforId = that.notices[i].id;
                    if (that.notices[i].type == 0) {
                      that.notices[i].linkUrl =
                        "/h5/views/notice/announcement.html?inforId=" + inforId;
                    } else if (that.notices[i].type == 1) {
                      that.notices[i].linkUrl =
                        "/h5/views/notice/projectDynamics.html?inforId=" +
                        inforId;
                    } else if (that.notices[i].type == 2) {
                      if (that.notices[i].mediaType == 1) {
                        that.notices[i].linkUrl =
                          "/h5/views/notice/mediaReport.html?inforId=" +
                          inforId;
                      } else if (that.notices[i].mediaType == 2) {
                        that.notices[i].linkUrl = that.notices[i].linkUrl;
                      }
                    }
                  }
                  return that.notices;
                }
              },
              methods: {
                jumpinvest: function(itemId, e) {
                  //保证进入到项目详情页一定是登录状态
                  if (!locationCodepar) {
                    isLogin(function() {
                      location.href =
                        "/h5/views/invest/invest.html?itemId=" + itemId;
                    });
                    e.preventDefault();
                  }
                },
                successjump: function(itemId, e) {
                  if (!locationCodepar) {
                    isLogin(function() {
                      location.href =
                        "/h5/views/invest/invest.html?itemId=" + itemId;
                    });
                    e.preventDefault();
                  }
                },
                repaymentjump: function(itemId, e) {
                  if (!locationCodepar) {
                    isLogin(function() {
                      location.href =
                        "/h5/views/invest/invest.html?itemId=" + itemId;
                    });
                    e.preventDefault();
                  }
                },
                toInvite: function() {
                  if (!locationCodepar) {
                    isLogin(function() {
                      location.href = "/h5/views/account/invite/invite.html";
                    });
                  }
                },
                noticesMore: function() {
                  location.href = "/h5/views/notice/information.html";
                },
                highlight: function() {
                  var patrn_null = /^\S{0}$/; //非空
                  var userpwdrealproving =
                    $("#userpwdreal").attr("proving") == 1 ? 1 : 0;
                  var userconfirmpwdrealproving =
                    $("#userconfirmpwdreal").attr("proving") == 1 ? 1 : 0;
                  var boolNull =
                    !patrn_null.test(this.userpwdreal) &&
                    !patrn_null.test(this.userconfirmpwdreal);
                  var boolproving =
                    userpwdrealproving && userconfirmpwdrealproving;
                  if (boolNull && boolproving) {
                    $(
                      ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                    ).removeAttr("disabled", "disabled");
                    $(
                      ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                    ).css({ color: "#ec6121" });
                  } else {
                    $(
                      ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                    ).attr("disabled", "disabled");
                    $(
                      ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                    ).css({ color: "#999" });
                  }
                },
                userpwdrealKeyup: function() {
                  var patrn_number = /^[0-9]*$/; //纯数字
                  if (!patrn_number.test(this.userpwdreal)) {
                    $("#userpwdreal").attr("proving", 0);
                    jumi.tips("支付密码格式错误！");
                    this.userpwdreal = "";
                    return;
                  }
                  if (this.userpwdreal.length == 6) {
                    $("#userpwdreal").attr("proving", 1);
                  } else {
                    $("#userpwdreal").attr("proving", 0);
                  }
                  this.highlight();
                },
                userconfirmpwdrealKeyup: function() {
                  var confirmpwdlen = this.userconfirmpwdreal.length;
                  if (confirmpwdlen == 6) {
                    if (this.userconfirmpwdreal == this.userpwdreal) {
                      $("#userconfirmpwdreal").attr("proving", 1);
                    } else {
                      $("#userconfirmpwdreal").attr("proving", 0);
                      jumi.tips("两次设置的支付密码不一致！");
                    }
                  } else {
                    $("#userconfirmpwdreal").attr("proving", 0);
                  }
                  this.highlight();
                }
              },
              filters: {
                tenthousand: function(value) {
                  if (value >= 10000) {
                    return value / 10000 + "万";
                  } else {
                    return value + "元";
                  }
                },
                reachrate: function(scale) {
                  return scale.toFixed(2);
                },
                cycleStr: function(cycleUnit) {
                  var cycleStr = "";
                  if (cycleUnit == "1") {
                    cycleStr = "日";
                  } else if (cycleUnit == "2") {
                    cycleStr = "周";
                  } else if (cycleUnit == "3") {
                    cycleStr = "个月";
                  } else if (cycleUnit == "4") {
                    cycleStr = "季";
                  } else if (cycleUnit == "5") {
                    cycleStr = "年";
                  }
                  return cycleStr;
                }
              }
            }
          },
          ready: function() {
            var that = this;
            var iIndex = 0;
            nav.setActiveNav("index");
            slidefocus.init({ id: "#slider" }); //////焦点图效果
            slidefocus.init({
              id: "#sliderNotice",
              width: "100%",
              height: "30%"
            }); //////资讯效果
            $(".async").asyncload(); //////异步加载图片
            $("#myloading").remove();
            numberboard.init("userpwdreal");
            numberboard.init("userconfirmpwdreal");

            if (
              localStorage.fromapp != "ios" &&
              localStorage.fromapp != "android"
            ) {
              appSpread.init();
            }

            //公告滚动
            var intervalId = 0;
            intervalId = setInterval(function() {
              var liFirst = $("#notices li:first");
              var liSecond = $("#notices li").eq(1);
              var liLast = $("#notices li:last");
              liFirst.animate({ opacity: 0 }, 1000, function() {
                liFirst.insertAfter(liLast);
                liSecond.animate({ opacity: 1 }, 1000);
              });
            }, 5000);

            // 自动登陆
            if (locationCodepar) {
              var locationCode = locationCodepar.split("&state=")[0];
              isLoginwx(locationCode, "/h5/views/main/index.html");
            }

            //分享
            weixin
              .setTitle()
              .setDesc()
              .setImg()
              .setUrl()
              .share();

            // 最新动态标题大于14个字显示省略号,内容超过40个字显示省略号，内容的br去掉。
            $(".information li").each(function(k, v) {
              var str = $(this)
                .find(".inforTitle")
                .html();
              var len = $(this)
                .find(".inforTitle")
                .html().length;
              if (len > 14) {
                $(this)
                  .find(".inforTitle")
                  .html(str.substring(0, 14) + "...");
              }
              var strCon = $(this)
                .find(".inforCon")
                .html();
              // var strCon2 = strCon.split("&lt;br&gt;",1).toString();
              var strCon2 = strCon.split("<br>", 1).toString();
              var lenCon = strCon2.length;
              if (lenCon > 40) {
                $(this)
                  .find(".inforCon")
                  .html(strCon2.substring(0, 40) + "...");
              } else {
                $(this)
                  .find(".inforCon")
                  .html(strCon2);
              }
            });

            var paraalert = {
              token: token,
              requestSource: "WAP"
            };
            // console.log(paraalert);
            $.ajax({
              url: "/common/getResetPayPasswordIndex",
              type: "post",
              datatype: "json",
              data: paraalert,
              success: function(data) {
                //console.log(data);
                if (data.code == "0000") {
                  if (data.data.isLogin == 1) {
                    //用户已经登录
                    if (data.data.hasChangePaypassword == 0) {
                      //表示老用户是否修改过支付密码0是“未修改过”1是“已经修改过”
                      // 首页的升级显示
                      jumi.alert({
                        title: "",
                        content:
                          '<div class="textcenter"><p>尊敬的用户：</p><p>聚米众筹进行了4.0账户安全升级，</p><p>请完成账户升级操作</p></div>',
                        button: [
                          {
                            value: "立即前往",
                            callback: function() {
                              $("#realname").html(data.data.realname);
                              $("#idNumber").html(data.data.idNumber);
                              jumi.alert({
                                title: "",
                                skin: "ui-dialog-upgrade",
                                content: document.getElementById("upgradeWrap"),
                                button: [
                                  {
                                    value: "立即修改",
                                    callback: function() {
                                      var parapwd = {
                                        password: md5(
                                          that.$children[0].userpwdreal
                                        ).toLocaleUpperCase(),
                                        newPassword: md5(
                                          that.$children[0].userpwdreal
                                        ).toLocaleUpperCase(),
                                        confirmPassword: md5(
                                          that.$children[0].userconfirmpwdreal
                                        ).toLocaleUpperCase(),
                                        pwdType: "paypassword",
                                        token: token,
                                        requestSource: "WAP"
                                      };
                                      // console.log(parapwd);
                                      $.ajax({
                                        url:
                                          "/userCenter/setting/resetPayPassword",
                                        type: "post",
                                        datatype: "json",
                                        data: parapwd,
                                        success: function() {
                                          if (data.code == "0000") {
                                            // var strtips = '<p class="upgradetips clr-gray font-12 textcenter" style="padding-bottom:14px;">*账户资金由北京银行存管对接中</p>';
                                            jumi.alert({
                                              title: "",
                                              skin: "ui-dialog-upsuccess",
                                              content: document.getElementById(
                                                "upsuccess"
                                              ),
                                              button: [
                                                {
                                                  value: "完成",
                                                  callback: function() {}
                                                }
                                              ]
                                            });
                                            // $(".ui-dialog-upsuccess").append(strtips);
                                          } else {
                                            jumi.tips(data.msg);
                                          }
                                        }
                                      });
                                    }
                                  }
                                ]
                              });
                              $(
                                ".ui-dialog .ui-dialog-footer button.ui-dialog-autofocus"
                              ).attr("disabled", "disabled");
                            }
                          }
                        ]
                      }); //alert结束
                    }
                  } //用户已经登录结束
                } //code已经结束
              } //success结束
            }); //ready情况下的  $ajax的情况
          } //ready的情况
        }); //new Vue的结束
      } else {
        jumi.tips(data.msg);
      }
    }
  });
});
