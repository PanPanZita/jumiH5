define([
  "jumi",
  "nav",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin",
  "md5"
], function (jumi, nav, isLogin, isLoginwx, vue, weixin, md5) {
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  $.ajax({
    url: "/userCenter/personalCenter/getMyPersonalCenter",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function (data) {
      console.log(data);
      //用户登录状态下的页面及操作
      if (data.code == "0000") {
        if (data.data) {
          new vue({
            el: "body",
            components: {
              "my-account": {
                template: "#accountTemplate",
                data: function () {
                  return {
                    data: data.data,
                    isLogin: true
                  };
                },
                // 过滤函数
                filters: {
                  myPhone: function (value) {
                    // console.log(value)
                    var value2 = value.substr(0, 3) + '****' + value.substr(7)
                    // console.log(value2)
                    return value2;
                  }
                },
                methods: {
                  toLink: function () {
                    if (this.data.statAcct == 1) {
                      //statAcct的状态值1表示处理中
                      jumi.alert({
                        title: "提示",
                        content: '<p class="textcenter">正在开户中，请稍后操作</p>',
                        button: [{
                          value: "知道了",
                          callback: function () {}
                        }]
                      });
                    } else {
                      //statAcct的状态值是0,9分别表示未开户和开户失败
                      location.href =
                        "/h5/views/account/settings/bankcardToBind.html?redirectURL=" +
                        location.pathname;
                    }
                  },
                  assets: function () {
                    location.href =
                      "/h5/views/account/assets/assets.html?redirectURL=" +
                      location.pathname;
                  },
                  closeMask: function () {
                    var that = this;
                    $.ajax({
                      url: "/common/updatePageGuide",
                      data: {
                        user_id: that.data.user_info.user_id
                      },
                      success: function (data) {
                        // console.log('取消了mask');
                        that.data.is_click = 1;
                      }
                    });
                  },
                  bankcard: function () {
                    var that = this;
                    // console.log(that.data.statAcct);
                    if (that.data.statAcct == 0 || that.data.statAcct == 9) {
                      //未开户，开户失败
                      jumi.alert({
                        skin: "ui-dialog-bankcard",
                        content: '<p class="textcenter">尊敬的用户：</p><p class="textcenter">您目前尚未开户</p>',
                        button: [{
                            value: "取消",
                            callback: function () {}
                          },
                          {
                            value: "立即开户",
                            callback: function () {
                              location.href =
                                "/h5/views/account/settings/bankcardToBind.html?redirectURL=" +
                                location.pathname;
                            }
                          }
                        ]
                      });
                    } else if (that.data.statAcct == 1) {
                      //开户处理中
                      jumi.alert({
                        title: "提示",
                        content: '<p class="textcenter">正在开户中，请稍后操作</p>',
                        button: [{
                          value: "知道了",
                          callback: function () {}
                        }]
                      });
                    } else {
                      location.href =
                        "/h5/views/account/settings/bankcardToShow.html?redirectURL=" +
                        location.pathname;
                    }
                  },
                  //升级改造
                  highlight: function () {
                    var patrn_null = /^\S{0}$/; //非空
                    var userpwdrealproving =
                      $("#userpwdreal").attr("proving") == 1 ? 1 : 0;
                    var userconfirmpwdrealproving =
                      $("#userconfirmpwdreal").attr("proving") == 1 ? 1 : 0;
                    var boolNull = !patrn_null.test(this.userpwdreal) &&
                      !patrn_null.test(this.userconfirmpwdreal);
                    var boolproving =
                      userpwdrealproving && userconfirmpwdrealproving;
                    if (boolNull && boolproving) {
                      $(
                        ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                      ).removeAttr("disabled", "disabled");
                      $(
                        ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                      ).css({
                        color: "#ec6121"
                      });
                    } else {
                      $(
                        ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                      ).attr("disabled", "disabled");
                      $(
                        ".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus"
                      ).css({
                        color: "#999"
                      });
                    }
                  },
                  userpwdrealKeyup: function () {
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
                  userconfirmpwdrealKeyup: function () {
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
                  },
                  // 充值
                  recharge: function () {
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
                      success: function (data) {
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
                              content: '<p class="textcenter">先绑定银行卡后才能充值哦~</p>',
                              button: [{
                                value: "去绑卡",
                                callback: function () {
                                  location.href =
                                    "/h5/views/account/settings/bankcardToBindAndCashout.html" +
                                    location.search;
                                }
                              }]
                            });
                          } else if (that.data.statBind == 1) {
                            //statBind的状态值1表示绑卡处理中
                            jumi.alert({
                              title: "提示",
                              content: '<p class="textcenter">正在绑卡中，请稍后操作</p>',
                              button: [{
                                value: "知道了",
                                callback: function () {}
                              }]
                            });
                          } else if (that.data.statBind == 2) {
                            //statBind的状态值2表示解绑处理中
                            jumi.alert({
                              title: "提示",
                              content: '<p class="textcenter">正在解绑中，请稍后操作</p>',
                              button: [{
                                value: "知道了",
                                callback: function () {}
                              }]
                            });
                          } else if (
                            that.data.statBind == 4 ||
                            that.data.statBind == 8
                          ) {
                            //statBind的状态值4，8分别表示解绑失败和绑卡成功
                            location.href = "/h5/views/account/assets/recharge.html" + location.search;
                          }
                        } else {
                          jumi.tips(data.msg);
                        }
                      } //success结尾
                    });
                  },
                  // 提现
                  cashout: function () {
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
                      success: function (data) {
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
                              content: '<p class="textcenter">先绑定银行卡后才能提现哦~</p>',
                              button: [{
                                value: "去绑卡",
                                callback: function () {
                                  location.href =
                                    "/h5/views/account/settings/bankcardToBindAndCashout.html" +
                                    location.search;
                                }
                              }]
                            });
                          } else if (that.data.statBind == 1) {
                            //statBind的状态值1表示绑卡处理中
                            jumi.alert({
                              title: "提示",
                              content: '<p class="textcenter">正在绑卡中，请稍后操作</p>',
                              button: [{
                                value: "知道了",
                                callback: function () {}
                              }]
                            });
                          } else if (that.data.statBind == 2) {
                            //statBind的状态值2表示解绑处理中
                            jumi.alert({
                              title: "提示",
                              content: '<p class="textcenter">正在解绑中，请稍后操作</p>',
                              button: [{
                                value: "知道了",
                                callback: function () {}
                              }]
                            });
                          } else if (
                            that.data.statBind == 4 ||
                            that.data.statBind == 8
                          ) {
                            //statBind的状态值4，8分别表示解绑失败和绑卡成功
                            location.href = "/h5/views/account/assets/cashout.html" + location.search;
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
            ready: function () {
              var that = this;
              nav.setActiveNav("account");
              $("#myloading").remove();
              var str = $(".nickname").html();
              var len = $(".nickname").html().length;
              if (len >= 7) {
                $(".nickname").html(str.substring(0, 6) + "...");
              }
              //分享
              weixin
                .setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();

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
                success: function (data) {
                  // console.log(data);
                  if (data.code == "0000") {
                    if (data.data.isLogin == 1) {
                      //用户已经登录
                      if (data.data.hasChangePaypassword == 0) {
                        //表示老用户是否修改过支付密码0是“未修改过”1是“已经修改过”
                        // 首页的升级显示
                        jumi.alert({
                          title: "",
                          content: '<div class="textcenter"><p>尊敬的用户：</p><p>聚米众筹进行了4.0账户安全升级，</p><p>请完成账户升级操作</p></div>',
                          button: [{
                            value: "立即前往",
                            callback: function () {
                              $("#realname").html(data.data.realname);
                              $("#idNumber").html(data.data.idNumber);
                              jumi.alert({
                                title: "",
                                skin: "ui-dialog-upgrade",
                                content: document.getElementById(
                                  "upgradeWrap"
                                ),
                                button: [{
                                  value: "立即修改",
                                  callback: function () {
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
                                      url: "/userCenter/setting/resetPayPassword",
                                      type: "post",
                                      datatype: "json",
                                      data: parapwd,
                                      success: function () {
                                        if (data.code == "0000") {
                                          // var strtips = '<p class="upgradetips clr-gray font-12 textcenter" style="padding-bottom:14px;">*账户资金由北京银行存管对接中</p>';
                                          jumi.alert({
                                            title: "",
                                            skin: "ui-dialog-upsuccess",
                                            content: document.getElementById(
                                              "upsuccess"
                                            ),
                                            button: [{
                                              value: "完成",
                                              callback: function () {}
                                            }]
                                          });
                                          // $(".ui-dialog-upsuccess").append(strtips);
                                        } else {
                                          jumi.tips(data.msg);
                                        }
                                      }
                                    });
                                  }
                                }]
                              });
                              $(
                                ".ui-dialog .ui-dialog-footer button.ui-dialog-autofocus"
                              ).attr("disabled", "disabled");
                            }
                          }]
                        }); //alert结束
                      }
                    } //用户已经登录结束
                  } //code已经结束
                } //success结束
              }); //ready情况下的  $ajax的情况
            }
          });
        }
      } //code的结束码

      //=====================================================================================================
      //用户未登录状态下的页面及操作
      else {
        new vue({
          el: "body",
          components: {
            "my-account": {
              template: "#accountTemplate",
              data: function () {
                return {
                  data: "",
                  isLogin: false
                };
              },
              methods: {
                toLogin: function () {
                  isLogin();
                }
              }
            }
          },
          ready: function () {
            //   微信登陆--该链接后面不带参数
            var url = location.href.split("?code=")[0];
            var locationCodepar = location.href.split("?code=")[1];
            if (locationCodepar) {
              var locationCode = locationCodepar.split("&state=")[0];
              isLoginwx(locationCode, url);
            }

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
              success: function (data) {
                // console.log(data);
                if (data.code == "0000") {
                  if (data.data.isLogin == 1) {
                    //用户已经登录
                    if (data.data.hasChangePaypassword == 0) {
                      //表示老用户是否修改过支付密码0是“未修改过”1是“已经修改过”
                      // 首页的升级显示
                      jumi.alert({
                        title: "",
                        content: '<div class="textcenter"><p>尊敬的用户：</p><p>聚米众筹进行了4.0账户安全升级，</p><p>请完成账户升级操作</p></div>',
                        button: [{
                          value: "立即前往",
                          callback: function () {
                            $("#realname").html(data.data.realname);
                            $("#idNumber").html(data.data.idNumber);
                            jumi.alert({
                              title: "",
                              skin: "ui-dialog-upgrade",
                              content: document.getElementById("upgradeWrap"),
                              button: [{
                                value: "立即修改",
                                callback: function () {
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
                                    url: "/userCenter/setting/resetPayPassword",
                                    type: "post",
                                    datatype: "json",
                                    data: parapwd,
                                    success: function () {
                                      if (data.code == "0000") {
                                        // var strtips = '<p class="upgradetips clr-gray font-12 textcenter" style="padding-bottom:14px;">*账户资金由北京银行存管对接中</p>';
                                        jumi.alert({
                                          title: "",
                                          skin: "ui-dialog-upsuccess",
                                          content: document.getElementById(
                                            "upsuccess"
                                          ),
                                          button: [{
                                            value: "完成",
                                            callback: function () {}
                                          }]
                                        });
                                        // $(".ui-dialog-upsuccess").append(strtips);
                                      } else {
                                        jumi.tips(data.msg);
                                      }
                                    }
                                  });
                                }
                              }]
                            });
                            $(
                              ".ui-dialog .ui-dialog-footer button.ui-dialog-autofocus"
                            ).attr("disabled", "disabled");
                          }
                        }]
                      }); //alert结束
                    }
                  } //用户已经登录结束
                } //code已经结束
              } //success结束
            }); //ready情况下的  $ajax的情况
          }
        });
      }
    },
    error: function () {
      jumi.tips("网络超时！");
    }
  });
});