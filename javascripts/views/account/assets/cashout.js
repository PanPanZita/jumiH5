define([
  "jumi",
  "nav",
  "vue",
  "isLogin",
  "isLoginwx",
  "md5",
  "weixin"
], function(jumi, nav, vue, isLogin, isLoginwx, md5, weixin) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  // console.log(parainit);
  isLogin(function() {
    $.ajax({
      url: "/userCenter/userAccount/getMyCashInfo",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-cashout": {
                template: "#cashoutTemplate",
                data: function() {
                  return {
                    data: data.data,
                    canCashMoney: data.data.canCashMoney, //可提现金额
                    cashFreeTimes: data.data.cashFreeTimes, // 剩余提现次数
                    fees: data.data.fees, //手续费
                    arriveMoney: 0, //实际到账金额
                    cashMoney: "", //提现金额
                    paypassword: "", //支付密码
                    isShowButton: true //是否灰显【确认提现】按钮
                  };
                },
                methods: {
                  //判断是否收取手续费
                  isFee: function() {
                    var that = this;
                    if (that.cashFreeTimes > 0) {
                      //免费
                      that.arriveMoney = that.cashMoney;
                    } else {
                      //收费
                      var realMoney =
                        Math.round((that.cashMoney - that.fees) * 100) / 100;
                      if (realMoney <= 0) {
                        that.arriveMoney = 0;
                      } else {
                        that.arriveMoney = realMoney;
                      }
                    }
                  },
                  //是否灰显【确认提现】按钮和是否显示显示实际到账信息
                  isClickappear: function() {
                    var that = this;
                    if (that.cashMoney != "") {
                      that.isShowButton = false;
                    } else {
                      that.isShowButton = true;
                    }
                  },
                  //全部提现
                  allCashout: function() {
                    var that = this;
                    // console.log(that.canCashMoney);
                    if (Number(that.canCashMoney) < 10) {
                      jumi.tips("提现金额最低10元！");
                      that.cashMoney = "";
                    } else {
                      that.cashMoney = that.canCashMoney;
                    }
                    that.isFee();
                    that.isClickappear();
                  },
                  //提现金额输入框
                  cashoutInputKeyup: function() {
                    var that = this;
                    that.isFee();
                    that.isClickappear();
                  },
                  //提现金额输入框
                  cashoutInputBlur: function() {
                    $(".footer").css({ display: "block" });
                    // 不能输入 类似00、01的数值
                    var that = this;
                    if (that.cashMoney.match(/^0\d+/)) {
                      that.cashMoney = that.cashMoney.replace(/^0(\d+)/, "$1");
                    }

                    // 小数点前没有数字，自动在前面加上0
                    if (that.cashMoney.match(/^\./)) {
                      that.cashMoney = that.cashMoney.replace(/\./, "0.");
                    }

                    //不能为负数
                    if (that.cashMoney.match(/^-/)) {
                      that.cashMoney = that.cashMoney.replace(/^-/, "");
                    }
                  },
                  cashoutInputFocus: function() {
                    $(".footer").css({ display: "none" });
                  },
                  //关于提现
                  aboutCashout: function() {
                    jumi.alert({
                      title: "温馨提示",
                      content:
                        "1.用户提现申请发起后，提款金额将在3个工作日内到账；<br/>2.单笔单日提现金额最高50万元，提现手续费根据用户对应的会员等级而定；<br/>具体会员等级权益请在个人中心的用户会员等级模块查看。如在提现中遇到任何问题，请拨打聚小米电话：18969000782",
                      button: false
                    });
                  },
                  cashouttips: function() {
                    jumi.alert({
                      title: "部分余额无法提现",
                      content:
                        "由于存管规则，部分金额在T+1日后，银行核对账目后才可提现，在此期间这些金额可以用于投资。",
                      button: false
                    });
                  },
                  // 重置支付密码框
                  resetpayStatus: function() {
                    var that = this;
                    var fakeinput = $(".fake input");
                    that.paypassword = "";
                    $(".active").css("left", 0 + "px");
                    var pwd = that.paypassword.trim(); //去掉字符串首尾空格
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
                  //确认提现
                  ok: function() {
                    var that = this;
                    that.resetpayStatus(); //每次点击确认提现，都重置密码。
                    var patrn_moneyNotZero = /^(([1-9]{1}\d*(\.\d{1,2})?)|(0\.([1-9]|\d[1-9])))$/; //金额必须大于0.00，保留两位小数
                    var val = that.cashMoney;

                    if (val < 10) {
                      jumi.tips("提现金额需大于等于10元！");
                      return;
                    } else if (val > Number(that.canCashMoney)) {
                      jumi.tips("账户余额不足！");
                      return;
                    } else if (!patrn_moneyNotZero.test(val)) {
                      jumi.tips("金额必须保留两位小数，且大于0.00");
                      return;
                    }
                    jumi.alert({
                      skin: "ui-dialog-paypwd",
                      title: "请输入6位数字支付密码",
                      content: document.getElementById("phonecodeWrap"),
                      button: [
                        {
                          value: "忘记密码？",
                          callback: function() {
                            location.href =
                              "/h5/views/account/settings/forgetPaypwd.html";
                          }
                        }
                      ]
                    });
                  },
                  //输入密码框
                  inputpwdKeyup: function() {
                    var that = this;
                    var patrn_number = /^[0-9]*$/;

                    var fakeinput = $(".fake input");
                    if (!that.paypassword) {
                      //用户没有输入的时候，光标仍在第一个
                      $(".active").css("left", 0 + "px");
                    }

                    if (patrn_number.test(that.paypassword)) {
                      var pwd = that.paypassword.trim();
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
                        var paraok = {
                          cashMoney: that.cashMoney,
                          payPassword: md5(
                            that.paypassword
                          ).toLocaleUpperCase(),
                          confirmPayPassword: md5(
                            that.paypassword
                          ).toLocaleUpperCase(),
                          token: token,
                          requestSource: "WAP"
                        };
                        // console.log(paraok);
                        $.ajax({
                          type: "post",
                          url: "/userCenter/userAccount/applyCash",
                          data: paraok,
                          dataType: "json",
                          success: function(data) {
                            // console.log(data);
                            if (data.code == "0000") {
                              location.href =
                                "/h5/views/account/assets/cashoutSuccess.html";
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
                  }
                }
              }
            },
            ready: function() {
              nav.setActiveNav("account");
              $("#myloading").remove();
              //分享
              weixin
                .setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();
            }
          }); //vue end
        } //if的结束
      }
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
