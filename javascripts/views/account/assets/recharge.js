define([
  "jumi",
  "nav",
  "tab",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin"
], function(jumi, nav, tab, isLogin, isLoginwx, vue, weixin) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  var count = 60;
  // console.log(token);
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/userAccount/getRechargeIndex",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-recharge": {
                template: "#rechargeTemplate",
                data: function() {
                  return {
                    data: data.data,
                    money: "", //充值金额
                    req_data: "",
                    isAbled: true,
                    orderNo: "", //申请单号
                    phonecode: "", //手机验证码
                    countdown: null,
                    count: 60
                  };
                },
                methods: {
                  inputMoneyKeyup: function() {
                    var val = this.money;
                    var patrn_null = /^\S{0}$/;
                    var patrn = /^(([1-9]{1}\d*(\.\d{1,2})?)|(0\.([1-9]|\d[1-9])))$/; //12.34 | 0.12  | 1234

                    if (!patrn_null.test(val) && patrn.test(val)) {
                      this.isAbled = false; //可以进行充值
                    } else {
                      this.isAbled = true;
                    }
                  },
                  inputMoneyBlur: function() {
                    var val = this.money;
                    var patrn_null = /^\S{0}$/;
                    var patrn = /^(([1-9]{1}\d*(\.\d{1,2})?)|(0\.([1-9]|\d[1-9])))$/;

                    if (patrn_null.test(val)) {
                      return;
                    }

                    if (!patrn.test(val)) {
                      jumi.tips("金额必须保留两位小数，且大于0.00");
                      this.money = "";
                    }
                  },
                  ok: function() {
                    var that = this;
                    // console.log(that);
                    clearInterval(that.countdown); //清除上次的定时器
                    that.resetpayStatus();
                    var paraok = {
                      rechargeMoney: that.money,
                      token: token,
                      requestSource: "WAP"
                    };
                    // console.log(paraok);
                    $.ajax({
                      type: "post",
                      url: "/userCenter/userAccount/confirmRecharge",
                      data: paraok,
                      dataType: "json",
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          $("#payForm").attr("action", data.data.rechargeUrl); //action就是要提交的地址
                          $("#req_data").val(data.data.reqData);
                          document.getElementById("payForm").submit();
                          // that.orderNo = data.data.orderNo;
                          // var phone = data.data.preMobile;
                          // var phonestr = phone.substring(0, 3) + "****" + phone.substring(7, 11);
                          // jumi.alert({
                          //     skin: 'ui-dialog-phone',
                          //     title: '本次交易需要短信确认，验证码已发送至您的手机' + phonestr + '',
                          //     content: document.getElementById('phonecodeWrap'),
                          //     button: [{
                          //         value: '60s',
                          //         callback: function() {
                          //             var paraok = {
                          //                 rechargeAmount: that.money,
                          //                 token: token,
                          //                 requestSource: 'WAP',
                          //             };
                          //             $.ajax({
                          //                 type: 'post',
                          //                 url: '/userCenter/userAccount/applyRecharge',
                          //                 data: paraok,
                          //                 dataType: 'json',
                          //                 success: function(data) {
                          //                     console.log(data);
                          //                     if (data.code == '0000') {
                          //                         that.count = 60;
                          //                         $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").css("opacity", "0.5");
                          //                         $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").attr("disabled", "disabled");
                          //                         that.countdown = setInterval(function() {
                          //                             that.count--;
                          //                             $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").html(that.count + 's');
                          //                             if (that.count <= 0) {
                          //                                 clearInterval(that.countdown);
                          //                                 $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").html("重新获取");
                          //                                 $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").css("opacity", "1");
                          //                                 $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").removeAttr("disabled", "disabled");
                          //                             }
                          //                         }, 1000);
                          //                     } else {
                          //                         jumi.tips(data.msg);
                          //                     }
                          //                 }
                          //             });
                          //             return false;
                          //         }
                          //     }]
                          // });
                          // $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").css("opacity", "0.5");
                          // $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").attr("disabled", "disabled");
                          // that.count = 60;
                          // that.countdown = setInterval(function() {
                          //     that.count--;
                          //     $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").html(that.count + 's');
                          //     if (that.count <= 0) {
                          //         clearInterval(that.countdown);
                          //         $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").html("重新获取");
                          //         $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").css("opacity", "1");
                          //         $(".ui-dialog-phone .ui-dialog-footer button.ui-dialog-autofocus").removeAttr("disabled", "disabled");
                          //     }
                          // }, 1000);
                        } else {
                          jumi.tips(data.msg);
                        }
                      }
                    });
                  },
                  aboutRecharge: function() {
                    jumi.alert({
                      title: "关于充值",
                      content:
                        "<div>" +
                        "<p><strong>温馨提示：</strong></p>" +
                        "<p>1、使用网上充值方式进行充值前必须开通个人网上银行；</p>" +
                        "<p>2、快捷充值时如遇充值金额大于您的银行卡单日上限，您可以通过以下几种方式完成充值。(1)可根据银行单日限额，多天/多次充值，达到所需金额。(2)使用网银进行充值</p>" +
                        "<p>3、充值服务由第三方支付机构连连支付提供充值服务，如在充值期间遇到任何问题，您可以联系：</p>" +
                        "<p>连连支付客服：400-600-5200 </p>" +
                        "<p>聚米众筹客服：400-801-4680</p>" +
                        "</div>",
                      button: false
                    });
                  },
                  // 重置手机验证码
                  resetpayStatus: function() {
                    var that = this;
                    var fakeinput = $(".fake input");
                    that.phonecode = "";
                    $(".active").css("left", 0 + "px");
                    var pwd = that.phonecode.trim(); //去掉字符串首尾空格
                    var len = pwd.length;
                    for (var i = 0; i < len; i++) {
                      fakeinput.eq(i).val(pwd[i]);
                      if (fakeinput.eq(i).next().length) {
                        //模拟光标改变left值
                        $(".active").css(
                          "left",
                          fakeinput.eq(i + 1).offset().left -
                            fakeinput.eq(0).offset().left -
                            parseInt($(".wrap").css("padding-left")) +
                            "px"
                        );
                      }
                    }
                    fakeinput.each(function(k, v) {
                      //清空当前input后的所有input值(很重要，虚假现象)
                      if (k >= len) {
                        $(this).val("");
                      }
                    });
                  },
                  //六位手机号验证码框
                  inputpwdKeyup: function() {
                    var that = this;
                    var fakeinput = $(".fake input");
                    var patrn_number = /^[0-9]*$/;

                    if (!that.phonecode) {
                      //用户没有输入的时候，光标仍在第一个
                      $(".active").css("left", 0 + "px");
                    }
                    if (patrn_number.test(that.phonecode)) {
                      var pwd = that.phonecode.trim();
                      var len = pwd.length;
                      for (var i = 0; i < len; i++) {
                        fakeinput.eq(i).val(pwd[i]);
                        if (fakeinput.eq(i).next().length) {
                          //模拟光标改变left值
                          $(".active").css(
                            "left",
                            fakeinput.eq(i + 1).offset().left -
                              fakeinput.eq(0).offset().left -
                              parseInt($(".wrap").css("padding-left")) +
                              "px"
                          );
                        }
                      }
                      fakeinput.each(function(k, v) {
                        //清空当前input后的所有input值(很重要，虚假现象)
                        if (k >= len) {
                          $(this).val("");
                        }
                      });
                      if (len == 6) {
                        //执行其他操作（判断密码是否正确）
                        var paraPhonecode = {
                          orderNo: that.orderNo,
                          rechargeAmount: that.money,
                          smsCode: that.phonecode, //短信验证码
                          token: token,
                          requestSource: "WAP"
                        };
                        $.ajax({
                          url: "/userCenter/userAccount/confirmRecharge",
                          type: "post",
                          dataType: "json",
                          data: paraPhonecode,
                          success: function(data) {
                            if (data.code == "0000") {
                              location.href =
                                "/h5/views/account/assets/rechargeSuccess.html" +
                                location.search;
                            } else {
                              jumi.tips(data.msg);
                              that.resetpayStatus();
                              document.getElementById("real").focus();
                            }
                          }
                        });
                      }
                    } else {
                      //清除输入的密码
                      jumi.tips("请输入6位数字支付密码");
                      that.resetpayStatus();
                    }
                  } //输入密码框结束
                }
              }
            },
            ready: function() {
              $("#myloading").remove();
              nav.setActiveNav("account");
              //分享
              weixin
                .setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();
            }
          });
        } else {
          jumi.tips(data.errorMsg);
        }
      } //success的结束
    });
  }); //isLogin的结束
  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
