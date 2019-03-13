define([
  "jumi",
  "limit",
  "getPara",
  "isLogin",
  "wx",
  "vue",
  "vueTouch",
  "weixin"
], function(jumi, limit, getPara, isLogin, wx, vue, vueTouch, weixin) {
  vue.use(vueTouch);
  var token = localStorage.getItem("token"); //判断是否是新用户
  var para = getPara.get();
  var itemid = para.itemid; //项目id
  var gearId = para.gearId; //档位id
  var addressId = !para.address_id ? 0 : para.address_id; //null是一个字符串
  var openId = para.openId;
  var parainit = {
    addressId: addressId, //刚开始没有地址的时候就传参数0，否则传真正的addressId
    requestSource: "WAP",
    gearId: gearId,
    token: token
  };
  $.ajax({
    url: "/needLogin/buy/getBuyOrderDetail",
    data: parainit,
    type: "post",
    dataType: "json",
    success: function(data) {
      //   console.log(data);
      if (data.code == "0000")
        new vue({
          el: "body",
          components: {
            "my-cart": {
              template: "#cartTemplate",
              data: function() {
                return {
                  data: data.data, //后台返回的数据
                  num: 1, //数量
                  total: 0, //合计
                  realtotal: 0, //实付
                  canUseHongbao: 0, //红包使用（红包抵扣金额）
                  isHongBao: true, //是否使用了红包
                  remark: "" //备注
                };
              },
              compiled: function() {
                var that = this;
                that.total = that.data.invPrice * that.num;
                that.canUseHongbao = Math.floor(
                  that.data.hongBaoRate / 1000 * that.data.invPrice * that.num
                );
                if (that.canUseHongbao > that.data.hongbaoBalance) {
                  that.canUseHongbao = that.data.hongbaoBalance;
                }
                that.realtotal = that.total - that.canUseHongbao;
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
                    "&address_id=" +
                    addressId +
                    "&costType=" +
                    costType;
                },
                //计算:合计/红包/实付
                count: function() {
                  var that = this;
                  that.total = that.data.invPrice * that.num;
                  that.canUseHongbao = Math.floor(
                    that.data.hongBaoRate / 1000 * that.data.invPrice * that.num
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
                    num2 = that.data.limitCount - that.data.singleSupportCount;
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

                //下一步
                next: function() {
                  var that = this;
                  var isUseHongBao = that.isHongBao ? 1 : 0;
                  var addressId = that.data.jmAddress
                    ? that.data.jmAddress.id
                    : 0;
                  var remark = !that.remark ? "" : that.remark;
                  //寄送订单必须有地址
                  if (that.data.orderType == 1 && !that.data.jmAddress) {
                    jumi.tips("请选择一个地址！");
                    return;
                  }
                  //备注订单de备注可填写可不填写
                  //微信支付
                  that.doWeixinPay();
                },
                // ---判断是否是微信浏览器start---
                is_weixin: function() {
                  var ua = navigator.userAgent.toLowerCase();
                  if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return true;
                  } else {
                    return false;
                  }
                },
                //向微信授权调用JS
                getWeixinJS: function() {
                  var that = this;
                  var url = decodeURIComponent(location.href.split("#")[0]);
                  var paraconfig = {
                    url: url,
                    requestSource: "WAP"
                  };
                  if (that.is_weixin()) {
                    $.ajax({
                      url: "/weixin/initJs",
                      type: "post",
                      dataType: "json",
                      data: paraconfig,
                      success: function(data) {
                        if (data.code == "0000") {
                          wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: data.data.appId, // 'gh_784eadfde93c', // 必填，公众号的唯一标识
                            timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                            nonceStr: data.data.noncestr, // 必填，生成签名的随机串
                            signature: data.data.signature, // 必填，签名，见附录1
                            jsApiList: [
                              "onMenuShareTimeline",
                              "onMenuShareAppMessage",
                              "onMenuShareQQ",
                              "onMenuShareWeibo",
                              "chooseImage",
                              "previewImage",
                              "getNetworkType",
                              "scanQRCode",
                              "chooseWXPay"
                            ]
                            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                          });
                        } else {
                          jumi.tips(data.msg);
                        }
                      },
                      error: function() {
                        console.log("ajax error.");
                      }
                    });
                  }
                },

                //微信支付接口
                doWeixinPay: function() {
                  var that = this;
                  var isUseHongBao = that.isHongBao ? 1 : 0;
                  var addressId = that.data.jmAddress
                    ? that.data.jmAddress.id
                    : 0;
                  that.getWeixinJS();
                  if (openId == undefined) {
                    //并没有授权
                    jumi.alert({
                      content: "微信授权中,请耐心等待...",
                      button: false
                    });
                    // alert("即将跳转：" + itemid);
                    location.href =
                      "/buy/userOAuth?gearId=" +
                      gearId +
                      "&itemid=" +
                      itemid +
                      "&remark=" +
                      that.remark +
                      "&invNum=" +
                      that.num +
                      "&requestSource=" +
                      "WAP";
                  } else if (openId == "") {
                    jumi.tips("未获取到openId");
                  } else {
                    //用户已经授权。所以会重新跳回到  下一步的那个页面，此时点击下一步
                    var parasecondnext = {
                      addressId: addressId, //地址id =====0
                      gearId: gearId, //档位id====757
                      invNum: that.num, //支持份数=====1
                      isUseHongBao: isUseHongBao, //是否使用红包=====true
                      openId: openId,
                      payChannel: "01", //支付渠道--微信  ===01
                      remark: that.remark, //备注信息
                      token: token,
                      requestSource: "WAP"
                    };
                    // alert(parasecondnext.addressId);
                    // alert(parasecondnext.gearId);
                    // alert(parasecondnext.invNum);
                    // alert(parasecondnext.isUseHongBao);
                    // alert(parasecondnext.openId);
                    // alert(parasecondnext.payChannel);
                    // alert(parasecondnext.remark);
                    // alert(parasecondnext.token);
                    // alert(parasecondnext.requestSource);
                    $.ajax({
                      type: "post",
                      url: "/needLogin/buy/toPay",
                      data: parasecondnext,
                      dataType: "json",
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          //微信支付
                          that.jsApiCall(data.data);
                        } else {
                          jumi.tips(data.msg);
                        }
                      }
                    });
                  }
                },
                jsApiCall: function(paraData) {
                  if (paraData.wcPay !== null) {
                    wx.chooseWXPay({
                      appId: paraData.wcPay.appId,
                      timestamp: paraData.wcPay.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                      nonceStr: paraData.wcPay.nonceStr, // 支付签名随机串，不长于 32 位
                      package: paraData.wcPay.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                      signType: paraData.wcPay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                      paySign: paraData.wcPay.paySign, // 支付签名
                      complete: function(res) {
                        // 接口调用完成时执行的回调函数，无论成功或失败都会执行
                        // alert(11);
                        // console.log(res);
                      },
                      success: function(res) {
                        // 支付成功后的回调函数
                        // alert("支付成功之后的itemid：" + itemid);
                        location.href =
                          "/h5/views/invest/investSuccess.html?itemid=" +
                          itemid +
                          "&investBillId=" +
                          paraData.investBillId;
                      },
                      error: function(msg) {
                        // 支付失败后的回调函数
                        // alert(33);
                        location.href =
                          "/h5/views/invest/investFail.html?errorMessage=" +
                          msg +
                          "&itemid=" +
                          itemid;
                      }
                    });
                  } else {
                    alert("paraData.wcPay为空");
                  }
                } //jsApiCall end
              } //methods 结束
            }
          }, //compontents  结束
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
  });
});
