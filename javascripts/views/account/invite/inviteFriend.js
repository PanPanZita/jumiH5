define(["jumi", "vue", "getPara", "weixin", "api", "md5"], function(
  jumi,
  vue,
  getPara,
  weixin,
  api,
  md5
) {
  var para = getPara.get();
  var shareUrl = location.href;
  var parainit = {
    userIdCode: para.u,
    requestSource: "WAP"
  };

  $.ajax({
    url: "/common/initInviteRegister",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      //   console.log(data);
      if (data.code == "0000") {
        if (data.data != null) {
          new vue({
            el: "body",
            components: {
              "my-redpacket": {
                template: "#redpacketTemplate",
                data: function() {
                  return {
                    data: data.data,
                    invitePhone: data.data.userPhone,
                    setIntervalID: "",
                    isHide: false, //判断是否显示领取成功界面
                    rewardValue: data.data.rewardValue, //红包
                    clickstatus: true, //防止注册按钮二次点击
                    phone: "",
                    phoneCode: "",
                    countTime: 60,
                    setIntervalCode: null,
                    sliderSuccess: false, //滑动是否通过
                    isShowHide: true, //获取验证码按钮true灰显，false显示出来
                    flagVoice: true, //获取语音验证码是否可点击(控制5s之后才可以再次请求获取语音验证码接口)
                    isShowHideRegister: true //注册领取按钮true灰显，false显示出来
                  };
                },
                watch: {
                  phone: function(nweVal, oldVal) {
                    var rePhone = /^1\d{10}$/;
                    var rePhoneCode = /^\d{4}$/;
                    var boolPhone = rePhone.test(this.phone);
                    var boolPhoneCode = rePhoneCode.test(this.phoneCode);
                    if (boolPhone && boolPhoneCode) {
                      //同时符合规则
                      this.isShowHideRegister = false;
                    } else {
                      //不符合规则
                      this.isShowHideRegister = true;
                    }
                  },
                  phoneCode: function(nweVal, oldVal) {
                    var rePhone = /^1\d{10}$/;
                    var rePhoneCode = /^\d{4}$/;
                    var boolPhone = rePhone.test(this.phone);
                    var boolPhoneCode = rePhoneCode.test(this.phoneCode);
                    if (boolPhone && boolPhoneCode) {
                      //同时符合规则
                      this.isShowHideRegister = false;
                    } else {
                      //不符合规则
                      this.isShowHideRegister = true;
                    }
                  }
                },
                methods: {
                  inputPhoneKeyup: function() {
                    var that = this;
                    var rePhone = /^1\d{10}$/;
                    if (rePhone.test(that.phone) && !that.sliderSuccess) {
                      //号码格式正确的同时还需要保证当前并不是倒计时状态
                      //获取验证码亮起来(并且在此处判断该手机号是否已经注册过)
                      that.isShowHide = false;
                      var paraCheck = {
                        phone: that.phone,
                        requestSource: "WAP"
                      };
                      $.ajax({
                        url: "/common/validatePhoneIsExist",
                        type: "post",
                        dataType: "json",
                        data: paraCheck,
                        success: function(data) {
                          //   console.log(data);
                          if (data.code == "0000") {
                            if (data.data.result) {
                              jumi.alert({
                                skin: "ui-dialog-redpacket",
                                content:
                                  "聚小米提醒您，<br>该红包只能送给聚米新成员哦~",
                                button: [
                                  {
                                    value: "取消",
                                    callback: function() {
                                      that.phone = "";
                                    }
                                  },
                                  {
                                    value: "我也要邀请",
                                    callback: function() {
                                      location.href =
                                        "/h5/views/account/invite/invite.html";
                                    }
                                  }
                                ]
                              });
                            }
                          } else {
                            jumi.tips(data.msg);
                          }
                        }
                      });
                    } else {
                      //获取验证码灰显
                      that.isShowHide = true;
                    }
                  },
                  //获取语音验证码
                  getVoicecode: function() {
                    var that = this;
                    if (that.flagVoice) {
                      var paraVoice = {
                        phone: that.phone,
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
                      bannerHidden: true, //验证通过后，验证码组件是否自动隐藏，默认为 true（这里不用默认的，会占据空间）
                      initHidden: true, //是否默认不渲染，设置为true时，不会自动渲染(false自动渲染)
                      callback: function(data) {
                        // 验证成功之后请求后台接口(前端滑动验证通过时会触发此回调)
                        // window.console && console.log(nc_token);
                        // window.console && console.log(data.csessionid);
                        // window.console && console.log(data.sig);
                        var paramsSlide = {
                          phone: that.phone,
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
                              // 验证成功之后验证码开始倒计时
                              jumi.tips("验证码发送成功，请注意查收...");
                              clearInterval(that.setIntervalCode);
                              that.sliderSuccess = true;
                              that.isShowHide = true;
                              that.setIntervalCode = setInterval(function() {
                                that.countTime--;
                                $(".getCode").html(
                                  that.countTime + "s后重新获取验证码"
                                );
                                if (that.countTime <= 0) {
                                  clearInterval(that.setIntervalCode);
                                  that.sliderSuccess = false; //重置滑块状态，未通过（因为可以重新滑动）
                                  that.countTime = 60;
                                  //获取验证码亮起来
                                  $(".getCode").html("重新获取");
                                  that.isShowHide = false;
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
                    that.isShowHide = true;
                    //   滑动验证end
                  },
                  protocols: function() {
                    var len = $("#protocolBox").children().length;
                    if (!len) {
                      $("#protocolBox").load(
                        "/h5/views/common/protocols.html",
                        function() {
                          jumi.alert({
                            title: "聚米众筹用户注册服务协议",
                            content: $("#protocolBox").html(),
                            button: [
                              {
                                value: "知道了"
                              }
                            ]
                          });
                        }
                      );
                    } else {
                      jumi.alert({
                        title: "聚米众筹用户注册服务协议",
                        content: $("#protocolBox").html(),
                        button: [
                          {
                            value: "知道了"
                          }
                        ]
                      });
                    }
                  },
                  //领取红包
                  toReceive: function() {
                    var that = this;
                    if (that.clickstatus) {
                      that.clickstatus = false;
                      var timeToken = new Date().getTime();
                      // console.log(timeToken);
                      var paraok = {
                        sourceType: 1, //2表示邀请好友的注册页面
                        registerPhone: that.phone,
                        phoneCode: that.phoneCode,
                        invitePhone: that.invitePhone,
                        timeToken: timeToken,
                        requestSource: "WAP"
                      };
                      $.ajax({
                        url: "/register/register",
                        type: "post",
                        dataType: "json",
                        data: paraok,
                        success: function(data) {
                          // console.log(data);
                          if (data.code == "0000") {
                            that.isHide = true;
                            localStorage.setItem("token", data.data.token);
                          } else {
                            jumi.tips(data.msg);
                            that.clickstatus = true;
                          }
                        }
                      });
                    }
                  },
                  toUse: function() {
                    location.href = "/h5/views/main/index.html";
                  }
                } //methods结束
              }
            },
            ready: function() {
              var that = this;
              $("#myloading").remove();

              if (localStorage.fromapp == "ios") {
                var o = {
                  title: that.$children[0].data.shareTitle,
                  desc: that.$children[0].data.shareContent,
                  img: that.$children[0].data.shareImage,
                  url: shareUrl
                };
                window.webkit.messageHandlers.share.postMessage(o);
              } else if (localStorage.fromapp == "android") {
                var o = {
                  title: that.$children[0].data.shareTitle,
                  desc: that.$children[0].data.shareContent,
                  img: that.$children[0].data.shareImage,
                  url: shareUrl
                };
                window.Android.callAndroidAction("0", JSON.stringify(o));
              } else {
                weixin
                  .setTitle(that.$children[0].data.shareTitle)
                  .setDesc(that.$children[0].data.shareContent)
                  .setImg(that.$children[0].data.shareImage)
                  .setUrl(shareUrl)
                  .share();
              }
            }
          });
        }
      } else {
        jumi.tips(data.msg);
      }
    }
  });
});
