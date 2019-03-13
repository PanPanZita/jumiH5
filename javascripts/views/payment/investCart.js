﻿define([
  "jumi",
  "limit",
  "getPara",
  "isLogin",
  "isLoginwx",
  "wx",
  "vue",
  "vueTouch",
  "md5",
  "weixin"
], function(
  jumi,
  limit,
  getPara,
  isLogin,
  isLoginwx,
  wx,
  vue,
  vueTouch,
  md5,
  weixin
) {
  vue.use(vueTouch); //数量加减可点击
  var token = localStorage.getItem("token"); //判断是否是新用户
  var para = getPara.get();
  var itemid = para.itemid; //项目id
  var gearId = para.gearId; //档位id
  var addressId = !para.address_id ? 0 : para.address_id; //null是一个字符串
  var parainit = {
    addressId: addressId, //刚开始没有地址的时候就传参数0，否则传真正的addressId
    requestSource: "WAP",
    gearId: gearId,
    token: token
  };
  // console.log(parainit);
  isLogin(function() {
    $.ajax({
      url: "/needLogin/buy/getBuyOrderDetail",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-cart": {
                template: "#cartTemplate",
                data: function() {
                  return {
                    data: data.data, //后台返回的数据
                    isHongBao: data.data.isHongBao == 1 ? true : false, //是否使用了红包(0-false未使用，1-true代表使用)
                    num: 1, //数量
                    total: 0, //合计
                    realtotal: 0, //实付
                    canUseHongbao: 0, //红包使用
                    remark: "", //备注
                    paypassword: "", //支付密码
                    investBillId: "", //投资订单id
                    transId: "", //交易单号
                    flag: true //输入支付密码时，防止用户重复输入设置的一个开关。
                  };
                },
                compiled: function() {
                  var that = this;
                  that.total = that.data.invPrice * that.num;
                  that.canUseHongbao = Math.floor(
                    (that.data.hongBaoRate / 1000) *
                      that.data.invPrice *
                      that.num
                  );
                  if (that.canUseHongbao > that.data.hongbaoBalance) {
                    that.canUseHongbao = that.data.hongbaoBalance;
                  }
                  that.realtotal = that.total - that.canUseHongbao;
                  that.realtotal = that.total - that.data.canUseHongbao;
                },
                methods: {
                  toLink: function() {
                    var that = this;
                    var costType = that.data.costType;
                    location.href =
                      "/h5/views/invest/investCartAddress.html?itemid=" +
                      itemid +
                      "&gearId=" +
                      gearId +
                      "&costType=" +
                      costType;
                  },
                  //计算:合计/红包/实付
                  count: function() {
                    var that = this;
                    that.total = that.data.invPrice * that.num;
                    that.canUseHongbao = Math.floor(
                      (that.data.hongBaoRate / 1000) *
                        that.data.invPrice *
                        that.num
                    );
                    if (that.canUseHongbao > that.data.hongbaoBalance) {
                      that.canUseHongbao = that.data.hongbaoBalance;
                    }
                    if (that.isHongBao) {
                      that.realtotal = that.total - that.canUseHongbao;
                    } else {
                      that.realtotal = that.total;
                    }
                  },
                  //加
                  add: function() {
                    var that = this;
                    var lastnum = 99,
                      num1 = 99,
                      num2 = 99;
                    //如果总份额限购，可购买的份数为：总限购份数-已支持份数(0:不限制 1：限制)
                    if (that.data.isLimitUser == 1) {
                      num1 = that.data.limitUser - that.data.supportCount;
                    }
                    //如果单人限购，可购买的份数为：单用户限购分数 - 用户已购买份数(0:不限购1：限购)
                    if (that.data.isCountLimit == 1) {
                      num2 =
                        that.data.limitCount - that.data.singleSupportCount;
                    }
                    if (num1 > num2) {
                      lastnum = num2;
                    } else {
                      lastnum = num1;
                    }
                    if (
                      that.data.isLimitUser == 1 &&
                      that.data.isCountLimit == 1 &&
                      that.num >= lastnum &&
                      num1 < num2
                    ) {
                      //如果总份额限购
                      jumi.tips("聚小米提醒您，该档位的剩余的库存不足～");
                      return;
                    }
                    if (
                      that.data.isLimitUser == 1 &&
                      that.data.isCountLimit == 1 &&
                      that.num >= lastnum &&
                      num1 > num2
                    ) {
                      //如果单人限购
                      jumi.tips("聚小米提醒您，您限购的份额已经不足～");
                      return;
                    }
                    if (that.data.isLimitUser == 1 && that.num >= lastnum) {
                      //如果总份额限购
                      jumi.tips("聚小米提醒您，该档位的剩余的库存不足～");
                      return;
                    }
                    if (that.data.isCountLimit == 1 && that.num >= lastnum) {
                      //如果单人限购
                      jumi.tips("聚小米提醒您，您限购的份额已经不足～");
                      return;
                    }
                    ++that.num;
                    that.count();
                  },
                  //减
                  del: function() {
                    var that = this;
                    if (that.num <= 1) {
                      jumi.tips("聚小米提醒您，购买数量不能低于1份~");
                      return;
                    }
                    --that.num;
                    that.count();
                  },
                  //开关
                  onoff: function() {
                    var that = this;
                    that.isHongBao = !that.isHongBao;
                    that.count();
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

                  //下一步
                  next: function() {
                    var that = this;
                    that.resetpayStatus(); //每次点击下一步，都重置密码。
                    var addressId = that.data.jmAddress
                      ? that.data.jmAddress.id
                      : 0;
                    var remark = !that.remark ? "" : that.remark;
                    var isUseHongBao = that.isHongBao ? 1 : 0;
                    var paranext = {
                      gearId: gearId, //档位id
                      invNum: that.num, //支持份数
                      addressId: addressId, //地址id
                      remark: remark, //备注信息
                      isUseHongBao: isUseHongBao, //是否使用红包
                      payChannel: "00", //支付渠道
                      token: token,
                      requestSource: "WAP"
                    };
                    // console.log(paranext);
                    $.ajax({
                      type: "post",
                      url: "/needLogin/buy/validateBuy",
                      data: paranext,
                      dataType: "json",
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          that.investBillId = data.data.investBillId;
                          that.transId = data.data.transId;
                          //寄送订单必须有地址
                          if (
                            that.data.orderType == 1 &&
                            !that.data.jmAddress
                          ) {
                            jumi.tips("请选择一个地址！");
                            return;
                          }

                          //是否需要绑卡1需要0不需要
                          if (data.data.isNeedBindcard == 1) {
                            location.href =
                              "/h5/views/account/settings/bankcardToBindAndCashout.html";
                          } else {
                            //备注订单de备注可填写可不填写
                            //实付金额小于账户余额(跳转到充值页面)
                            if (data.data.isNeedRecharge == 0) {
                              location.href =
                                "/h5/views/account/assets/recharge.html";
                            } else {
                              //实付金额大于等于账户余额---弹出密码框
                              jumi.alert({
                                skin: "ui-dialog-paypwd",
                                title: "请输入6位数字支付密码",
                                content: document.getElementById(
                                  "phonecodeWrap"
                                ),
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
                            }
                          }
                        } else {
                          jumi.tips(data.msg);
                        }
                      }
                    });
                  },
                  //输入密码框
                  inputpwdKeyup: function() {
                    var that = this;
                    // console.log(that);
                    var addressId = that.data.jmAddress
                      ? that.data.jmAddress.id
                      : 0;
                    var remark = !that.remark ? "" : that.remark;
                    var isUseHongBao = that.isHongBao ? 1 : 0;
                    var patrn_number = /^[0-9]*$/;

                    var fakeinput = $(".fake input");
                    if (!that.paypassword) {
                      //用户没有输入的时候，光标仍在第一个
                      $(".active").css("left", 0 + "px");
                    }

                    // console.log(that.paypassword);
                    if (patrn_number.test(that.paypassword)) {
                      var pwd = that.paypassword.trim(); //去掉字符串首尾空格
                      var len = pwd.length;
                      for (var i = 0; i < len; i++) {
                        fakeinput.eq(i).val(pwd[i]);
                        // alert('展示给虚拟框的值是：'+fakeinput.eq(i).val());
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
                        //清空当前input后的所有input值(很重要，虚假现象),k的值是0-1-2-3-4-5。
                        // console.log(k);
                        // console.log(len);
                        if (k >= len) {
                          $(this).val(""); //this就相当于$(".fake input")
                        }
                      });
                      if (len == 6) {
                        $("#real").attr("disabled", "disabled");
                        //执行其他操作（判断密码是否正确）
                        var parapaypwd = {
                          transId: that.transId,
                          investBillId: that.investBillId,
                          addressId: addressId, //地址id
                          gearId: gearId, //档位id
                          invNum: that.num, //支持份数
                          isUseHongBao: isUseHongBao,
                          payChannel: "00", //支付渠道  [00余额支付。01微信支付。02支付宝支付]
                          payPassword: md5(
                            that.paypassword
                          ).toLocaleUpperCase(),
                          remark: remark, //备注信息
                          requestSource: "WAP",
                          token: token
                        };
                        if (that.flag) {
                          $.ajax({
                            url: "/needLogin/buy/toPay",
                            type: "post",
                            dataType: "json",
                            data: parapaypwd,
                            async: false,
                            success: function(data) {
                              // console.log(data);
                              that.flag = false;
                              if (data.code == "0000") {
                                //购买结果--支持成功
                                location.href =
                                  "/h5/views/invest/investSuccess.html?itemid=" +
                                  itemid +
                                  "&investBillId=" +
                                  data.data.investBillId;
                              } else if (data.code == "1059") {
                                //支付密码失败
                                setTimeout(function() {
                                  $("#real").removeAttr("disabled", "disabled");
                                }, 1000);
                                that.flag = true;
                                jumi.tips(data.msg);
                                that.resetpayStatus();
                                document.getElementById("real").focus();
                              } else {
                                //购买结果--支持失败
                                location.href =
                                  "/h5/views/invest/investFail.html?errorMessage=" +
                                  data.msg +
                                  "&itemid=" +
                                  itemid;
                              }
                            }
                          });
                        }
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
              $("#myloading").remove();
              ////////文本框字数限制
              limit({
                dom: "[data-remark]",
                numDom: "[data-limitnumber]",
                max: 150
              });
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

  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
