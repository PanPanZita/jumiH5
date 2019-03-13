define(["jumi", "vue", "getPara", "weixin"], function(
  jumi,
  vue,
  getPara,
  weixin
) {
  var para = getPara.get();
  var parainit = {
    investBillId: para.investLogid,
    code: para.code,
    requestSource: "WAP"
  };
  $.ajax({
    url: "/hongbao/cashHongbao/getRevResult",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      //   console.log(data);
      if (data.code == "0000") {
        if (data.data.revResult.hasRedirect == 1) {
          location.href = data.data.revResult.redirectUrl;
        } else {
          new vue({
            el: "body",
            components: {
              "my-redpacket": {
                template: "#redpacketTemplate",
                data: function() {
                  return {
                    revResult: data.data.revResult, //领取结果
                    count: data.data.revResult.count, //红包数量
                    nickName: data.data.revResult.nickName, //用户微信昵称
                    revAmt: data.data.revResult.revAmt, //领取金额
                    phone: data.data.revResult.phone, //领取用户手机号
                    openId: data.data.revResult.openId, //用户信息
                    unionId: data.data.revResult.unionId, // 用户信息
                    nickName: data.data.revResult.nickName, //用户微信昵称
                    initRevStatus: data.data.revResult.revStatus, //初始化页面时的页面展示情况
                    userHeadImgUrl: data.data.revResult.userHeadImgUrl, //领取用户微信头像地址
                    revUserInfoList: data.data.revResult.revUserInfoList, //领取用户列表
                    shareInfo: data.data.shareInfo, //分享信息
                    clickstatus: true, //防止二次点击
                    clickRegister: true, //新用户注册的时候去领取红包防止二次点击
                    pageShowstatus: 0, //控制页面的展示情况 （0微信号未领取，1微信号未关联手机号，2微信号已关联手机号已领取，3红包个数不足，4分享红包账户余额不足）
                    userphone: "", //未关联手机号状态 ---   手机号
                    phoneCode: "", //未关联手机号状态 ---
                    countTime: 60, //未关联手机号状态 ---
                    setIntervalCode: null, //未关联手机号状态 ---
                    sliderSuccess: false, //滑动是否通过
                    flagVoice: true, //获取语音验证码是否可点击(控制5s之后才可以再次请求获取语音验证码接口)
                    isNewUser: "" //是否是新用户
                  };
                },
                watch: {
                  phone: function(nweVal, oldVal) {
                    var rePhone = /^1\d{10}$/;
                    var rePhoneCode = /^\d{4}$/;
                    var boolPhone = rePhone.test(this.userphone);
                    var boolPhoneCode = rePhoneCode.test(this.phoneCode);
                    if (boolPhone && boolPhoneCode) {
                      //同时符合规则
                      $(".pullDown").removeAttr("disabled");
                      $(".pullDown").removeClass("disabled");
                    } else {
                      //不符合规则
                      $(".pullDown").attr("disabled", "disabled");
                      $(".pullDown").addClass("disabled");
                    }
                  },
                  phoneCode: function(nweVal, oldVal) {
                    var rePhone = /^1\d{10}$/;
                    var rePhoneCode = /^\d{4}$/;
                    var boolPhone = rePhone.test(this.userphone);
                    var boolPhoneCode = rePhoneCode.test(this.phoneCode);
                    if (boolPhone && boolPhoneCode) {
                      //同时符合规则
                      $(".pullDown").removeAttr("disabled");
                      $(".pullDown").removeClass("disabled");
                    } else {
                      //不符合规则
                      $(".pullDown").attr("disabled", "disabled");
                      $(".pullDown").addClass("disabled");
                    }
                  }
                },
                methods: {
                  //领取红包
                  toReceive: function(e) {
                    var that = this;
                    var params = {
                      investBillId: para.investLogid,
                      nickName: that.nickName,
                      openId: that.openId,
                      requestSource: "WAP",
                      unionId: that.unionId,
                      userHeadImgUrl: that.userHeadImgUrl
                    };
                    if (that.clickstatus) {
                      that.clickstatus = false;

                      $.ajax({
                        url: "/hongbao/cashHongbao/receiveHongbao",
                        type: "post",
                        dataType: "json",
                        data: params,
                        success: function(data) {
                          //   console.log(data);
                          if (data.code == "0000") {
                            //是否已经关联该手机号   0：没有；1：有
                            if (data.data.hasRegister == 0) {
                              that.pageShowstatus = 1;
                            } else if (data.data.hasRegister == 1) {
                              that.revUserInfoList = data.data.revUserInfoList;
                              if (data.data.revStatus == 2) {
                                //手慢了
                                that.pageShowstatus = 3;
                                that.count = data.data.count;
                              } else if (data.data.revStatus == 3) {
                                //开小差
                                that.pageShowstatus = 4;
                              } else {
                                //正常领取
                                that.pageShowstatus = 2;
                                that.revAmt = data.data.revAmt;
                                that.phone = data.data.phone;
                              }
                            }
                          } else {
                            jumi.tips(data.msg);
                            that.clickstatus = true;
                          }
                        }
                      });
                    }
                    //alert("默认行为被禁止喽");
                    e.preventDefault();
                    return false;
                  },
                  inputPhoneKeyup: function() {
                    var rePhone = /^1\d{10}$/;
                    if (rePhone.test(this.userphone) && !this.sliderSuccess) {
                      //号码格式正确的同时还需要保证当前并不是倒计时状态
                      //获取验证码亮起来
                      $(".getCode").removeAttr("disabled");
                      $(".getCode").removeClass("disabled");
                    } else {
                      //获取验证码灰显
                      $(".getCode").attr("disabled", "disabled");
                      $(".getCode").addClass("disabled");
                    }
                  },
                  //获取语音验证码
                  getVoicecode: function() {
                    var that = this;
                    if (that.flagVoice) {
                      var paraVoice = {
                        phone: that.userphone,
                        requestSource: "WAP"
                      };
                      that.flagVoice = false;
                      $.ajax({
                        url: "/common/authcode/voiceCode",
                        type: "get",
                        datatype: "json",
                        data: paraVoice,
                        success: function(res) {
                          if (res.code == "0000") {
                            jumi.tips("语音验证码发送成功，请注意接听来电...");
                          } else {
                            jumi.tips(res.msg);
                          }
                          setTimeout(function() {
                            that.flagVoice = true;
                          }, 5000);
                        }
                      });
                    }
                  },
                  getCode: function() {
                    var that = this;
                    $(".getVoicecode").removeAttr("disabled");
                    $(".getVoicecode").removeClass("disabled");
                    // 滑动验证start
                    var nc_token = [
                      "FFFF0N00000000005AD9",
                      new Date().getTime(),
                      Math.random()
                    ].join(":");
                    var nc = NoCaptcha.init({
                      renderTo: "#sliderNc",
                      appkey: "FFFF0N00000000005AD9",
                      scene: "nc_register_h5",
                      token: nc_token,
                      trans: { key1: "code0" },
                      elementID: ["usernameID"],
                      is_Opt: 0,
                      language: "cn",
                      timeout: 10000,
                      retryTimes: 5,
                      errorTimes: 5,
                      inline: false, //弹出二次验证是否为inline方式，默认为false(浮层模式),如果是true的话就是在本页面
                      apimap: {
                        // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
                        // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
                      },
                      bannerHidden: true, //验证通过后，验证码组件是否自动隐藏，默认为 true
                      initHidden: true, //是否默认不渲染，设置为true时，不会自动渲染(false自动渲染)
                      callback: function(data) {
                        // 验证成功之后请求后台接口(前端滑动验证通过时会触发此回调)
                        // window.console && console.log(nc_token);
                        // window.console && console.log(data.csessionid);
                        // window.console && console.log(data.sig);
                        // 验证成功之后验证码开始倒计时
                        var paramsSlide = {
                          phone: that.userphone,
                          scence: "nc_register_h5",
                          sessionId: data.csessionid,
                          sig: data.sig,
                          token: nc_token
                        };
                        $.ajax({
                          url: "/common/authcode/slidValidate",
                          type: "post",
                          datatype: "json",
                          data: paramsSlide,
                          success: function(res) {
                            if (res.code == "0000") {
                              jumi.tips("验证码发送成功，请注意查收...");
                              clearInterval(that.setIntervalCode);
                              that.sliderSuccess = true;
                              $(".getCode").attr("disabled", "disabled");
                              $(".getCode").addClass("disabled");
                              that.setIntervalCode = setInterval(function() {
                                that.countTime--;
                                $(".getCode").html(that.countTime + "s");
                                if (that.countTime <= 0) {
                                  clearInterval(that.setIntervalCode);
                                  that.sliderSuccess = false; //重置滑块状态，未通过（因为可以重新滑动）
                                  that.countTime = 60;
                                  //获取验证码亮起来
                                  $(".getCode").html("重新获取");
                                  $(".getCode").removeAttr("disabled");
                                  $(".getCode").removeClass("disabled");
                                }
                              }, 1000);
                            } else {
                              jumi.tips(res.msg);
                            }
                          }
                        });
                      },
                      error: function(s) {}
                    });
                    NoCaptcha.setEnabled(true);
                    nc.reset(); //请务必确保这里调用一次reset()方法

                    NoCaptcha.upLang("cn", {
                      LOADING: "加载中...", //加载
                      SLIDER_LABEL: "请按住滑块，拖动到最右边", //等待滑动
                      CHECK_Y: "验证通过", //通过
                      ERROR_TITLE: "非常抱歉，这出错了...", //拦截
                      CHECK_N: "验证未通过", //准备唤醒二次验证
                      OVERLAY_INFORM:
                        "经检测你当前操作环境存在风险，请输入验证码", //二次验证
                      TIPS_TITLE: "验证码错误，请重新输入" //验证码输错时的提示
                    });
                    nc.show();
                    $(".getCode").attr("disabled", "disabled");
                    $(".getCode").addClass("disabled");
                    //   滑动验证end
                  },
                  pullDown: function() {
                    var that = this;
                    var params = {
                      investBillId: para.investLogid,
                      nickName: that.nickName,
                      openId: that.openId,
                      phone: that.userphone,
                      code: that.phoneCode,
                      unionId: that.unionId,
                      userHeadImgUrl: that.userHeadImgUrl,
                      requestSource: "WAP"
                    };
                    if (that.clickRegister) {
                      that.clickRegister = false;
                      $.ajax({
                        url: "/hongbao/cashHongbao/registerReceive",
                        type: "post",
                        data: params,
                        dataType: "json",
                        success: function(data) {
                          // console.log(data);
                          if (data.code == "0000") {
                            localStorage.setItem("token", data.data.token);
                            that.revUserInfoList = data.data.revUserInfoList;
                            that.revAmt = data.data.revAmt;
                            that.phone = data.data.phone;
                            // isNewUser  0：不是；1：是
                            // 此时的revStstus代表的是点击完领取按钮之后的状态值

                            //新用户首次领取现金红包
                            if (
                              data.data.isNewUser == 1 &&
                              data.data.revStatus == 1
                            ) {
                              that.isNewUser = 1; //按钮的展示文字是  ‘去提现’
                              that.pageShowstatus = 2;
                            }
                            //老用户领取现金红包
                            if (
                              data.data.isNewUser == 0 &&
                              data.data.revStatus == 1
                            ) {
                              that.isNewUser = 0; //按钮的展示文字是  参与众筹，得现金红包
                              that.pageShowstatus = 2;
                            }
                            //已领取完（手慢了）
                            if (data.data.revStatus == 2) {
                              that.pageShowstatus = 3;
                              that.count = data.data.count;
                            }
                            //开小差
                            if (data.data.revStatus == 3) {
                              that.pageShowstatus = 4;
                            }
                          } else {
                            jumi.tips(data.msg);
                          }
                        }
                      });
                    } else {
                      //   jumi.tips(data.msg);
                      jumi.tips("您的操作过于频繁，请稍后再试~");
                      that.clickRegister = true;
                    }
                  }
                } //methods结束
              } //my-redpacket的结束
            }, //components的结束
            ready: function() {
              var that = this;
              $("#myloading").remove();

              // initRevStatus  0:未领取;1:已领取;2:已领取完
              if (that.$children[0].initRevStatus == 0) {
                that.$children[0].pageShowstatus = 0;
              } else if (that.$children[0].initRevStatus == 1) {
                that.$children[0].pageShowstatus = 2;
                jumi.tips("您已经领过该红包了~");
              } else if (that.$children[0].initRevStatus == 2) {
                that.$children[0].pageShowstatus = 3;
              }

              //分享
              if (localStorage.fromapp == "ios") {
                var o = {
                  title: that.$children[0].shareInfo.shareTitle,
                  desc: that.$children[0].shareInfo.shareContent,
                  img: that.$children[0].shareInfo.shareImageUrl,
                  url: that.$children[0].shareInfo.shareLinkUrl
                };
                window.webkit.messageHandlers.share.postMessage(o);
              } else if (localStorage.fromapp == "android") {
                var o = {
                  title: that.$children[0].shareInfo.shareTitle,
                  desc: that.$children[0].shareInfo.shareContent,
                  img: that.$children[0].shareInfo.shareImageUrl,
                  url: that.$children[0].shareInfo.shareLinkUrl
                };
                window.Android.callAndroidAction("0", JSON.stringify(o));
              } else {
                weixin
                  .setTitle(that.$children[0].shareInfo.shareTitle)
                  .setDesc(that.$children[0].shareInfo.shareContent)
                  .setImg(that.$children[0].shareInfo.shareImageUrl)
                  .setUrl(that.$children[0].shareInfo.shareLinkUrl)
                  .share();
              }
            }
          }); //new Vue  的结束
        }
      } //code  的结束
    } //success的结束
  });
});
