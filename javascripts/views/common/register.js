define(["jumi", "vue", "getPara", "api", "md5", "weixin", "dialog"], function(
  jumi,
  vue,
  getPara,
  api,
  md5,
  weixin,
  dialog
) {
  var paraTitle = getPara.get();

  var vm = new vue({
    el: "body",
    components: {
      "my-register": {
        template: "#registerTemplate",
        data: function() {
          return {
            phone: "",
            password: "",
            phone_code: "",
            invite_phone: paraTitle.invitePhone,
            isShowHideRegister: true,
            isinvitePhone: true, //判断邀请人手机号是否合格
            setIntervalID: "",
            countTime: 60,
            clickstatus: true, //防止注册按钮二次点击
            setIntervalCode: null,
            isShowHide: true, //获取验证码按钮true灰显，false显示出来
            flagVoice: true, //获取语音验证码是否可点击(控制5s之后才可以再次请求获取语音验证码接口)
            itemLabel: paraTitle.itemFlag, //从项目详情页面进来的参数
            sliderSuccess: false //滑动是否通过
          };
        },
        methods: {
          toShowHide: function() {
            var patrn_null = /^\S{0}$/; //非空
            var patrn_mobile = /^(13|14|15|16|18|17|19)\d{9}$/; //手机号码
            var patrn_pwd = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; //必须是数字字母的组合

            var boolPhone =
              patrn_null.test(this.phone) || !patrn_mobile.test(this.phone); //找到不符合格式的点
            var boolPassword =
              patrn_null.test(this.password) || !patrn_pwd.test(this.password); //找到不符合格式的点

            if (boolPhone || boolPassword) {
              //一旦有一个不符合格式的地方
              this.isShowHide = true;
            } else {
              this.isShowHide = false;
            }
          },
          toShowHideResiter: function() {
            var patrn_null = /^\S{0}$/; //非空
            var patrn_length_fixed = /^\S{4}$/; //固定长度区间
            var patrn_mobile = /^(13|14|15|16|18|17|19)\d{9}$/; //手机号码
            var patrn_pwd = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; //必须是数字字母的组合

            var boolPhone =
              patrn_null.test(this.phone) || !patrn_mobile.test(this.phone); //找到不符合格式的点
            var boolPassword =
              patrn_null.test(this.password) || !patrn_pwd.test(this.password); //找到不符合格式的点
            var boolCode =
              patrn_null.test(this.phone_code) ||
              !patrn_length_fixed.test(this.phone_code); //找到不符合格式的点

            if (boolPhone || boolPassword || boolCode) {
              //一旦有一个不符合格式的地方
              this.isShowHideRegister = true;
            } else {
              this.isShowHideRegister = false;
            }
          },
          inputPhoneBlur: function() {
            var that = this;
            var val = this.phone;
            var patrn_null = /^\S{0}$/; //非空
            var patrn = /^(13|14|15|16|18|17|19)\d{9}$/; //手机号码

            if (patrn_null.test(val)) {
              return;
            }

            if (!patrn.test(val)) {
              jumi.tips("手机号码格式不正确！");
              return;
            }

            var para = {
              phone: this.phone,
              requestSource: "WAP"
            };
            $.ajax({
              url: "/common/validatePhoneIsExist",
              type: "post",
              dataType: "json",
              data: para,
              success: function(data) {
                // console.log(data);
                if (data.code == "0000") {
                  if (data.data.result) {
                    jumi.alert({
                      skin: "ui-dialog-bankcard",
                      content: "该手机号码已注册，请直接登录！",
                      button: [
                        {
                          value: "取消",
                          callback: function() {
                            that.phone = "";
                          }
                        },
                        {
                          value: "登录",
                          callback: function() {
                            location.href = "/h5/views/account/account.html";
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
          },
          inputPhoneKeyup: function() {
            var patrn_length = /^\S{11}$/; //长度区间
            var patrn_number = /^[0-9]*$/; //纯数字

            if (!patrn_number.test(this.phone)) {
              jumi.tips("手机号码格式不正确！");
              return;
            }

            if (!patrn_length.test(this.phone)) {
              this.phone = this.phone.substring(0, 11);
            }
            this.toShowHide();
            this.toShowHideResiter();
          },
          inputPasswordBlur: function() {
            var patrn_null = /^\S{0}$/; //非空
            var patrn_pwd = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

            if (patrn_null.test(this.password)) {
              return;
            }

            if (!patrn_pwd.test(this.password)) {
              jumi.tips("密码应为6-16位字母和数字组合");
              return;
            }
          },
          inputPasswordKeyup: function() {
            var patrn_null = /^\S{0}$/; //非空
            var patrn_length = /^\S{6,16}$/; //长度区间

            if (patrn_null.test(this.password)) {
              return;
            }

            if (!patrn_length.test(this.password)) {
              this.password = this.password.substring(0, 16);
            }

            this.toShowHide();
            this.toShowHideResiter();
          },
          inputCodeKeyup: function() {
            var patrn_null = /^\S{0}$/; //非空
            var patrn_length = /^\S{4}$/; //长度区间

            if (patrn_null.test(this.phone_code)) {
              return;
            }

            if (!patrn_length.test(this.phone_code)) {
              this.phone_code = this.phone_code.substring(0, 4);
            }

            this.toShowHideResiter();
          },
          inputInvitePhone: function() {
            var that = this;
            var val = that.invite_phone;
            var patrn_null = /^\S{0}$/; //非空
            var patrn = /^(13|14|15|16|18|17|19)\d{9}$/; //手机号码
            var patrn_number = /^[0-9]*$/; //纯数字

            if (patrn_null.test(val)) {
              that.isinvitePhone = true;
              return;
            }

            if (!patrn_number.test(val)) {
              jumi.tips("手机号码格式不正确！");
              return;
            }

            if (!patrn.test(val)) {
              jumi.tips("手机号码格式不正确！");
              that.isinvitePhone = false;
              return;
            }

            var para = {
              phone: that.invite_phone,
              requestSource: "WAP"
            };
            $.ajax({
              url: "/common/validatePhoneIsExist",
              type: "post",
              dataType: "json",
              data: para,
              success: function(data) {
                // console.log(data);
                if (data.code === "0000") {
                  if (!data.data.result) {
                    that.isinvitePhone = false;
                    jumi.tips("邀请人不存在！");
                    return;
                  }
                } else {
                  jumi.tips(data.msg);
                }
              }
            });
          },
          inputInvitePhoneKeyup: function() {
            var patrn_length = /^\S{11}$/; //长度区间
            var patrn_number = /^[0-9]*$/; //纯数字

            if (!patrn_number.test(this.invite_phone)) {
              jumi.tips("手机号码格式不正确！");
              return;
            }

            if (!patrn_length.test(this.invite_phone)) {
              this.invite_phone = this.invite_phone.substring(0, 11);
            }
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
              OVERLAY_INFORM: "经检测你当前操作环境存在风险，请输入验证码", //二次验证
              TIPS_TITLE: "验证码错误，请重新输入" //验证码输错时的提示
            });
            nc.show();
            $(".getCode").attr("disabled", "disabled");
            $(".getCode").addClass("disabled");
            //   滑动验证end
          },
          ok: function() {
            var that = this;
            if (that.clickstatus) {
              that.clickstatus = false;
              var para = {
                sourceType: 1, //1表示普通的注册页
                registerPhone: that.phone,
                password: md5(that.password).toLocaleUpperCase(),
                phoneCode: that.phone_code,
                invitePhone: that.invite_phone,
                itemLabel: that.itemLabel, //项目是否带标签
                requestSource: "WAP"
              };
              if (that.isinvitePhone) {
                //必须满足邀请人的格式也是正确的
                var timeToken = new Date().getTime();
                // console.log(timeToken);
                para.timeToken = timeToken;
                $.ajax({
                  url: "/register/shareRegister",
                  type: "post",
                  dataType: "json",
                  data: para,
                  success: function(data) {
                    // console.log(data);
                    if (data.code === "0000") {
                      sessionStorage.setItem("token", data.data.token);
                      jumi.alert({
                        skin: "ui-dialog-bankcard",
                        content:
                          '<p style="text-align:center">注册成功！</p><p class="clr-gray font-12" style="text-align:center;margin-top:0.5rem">为了您的账户安全，请完成实名认证</p>',
                        button: [
                          {
                            value: "首页",
                            callback: function() {
                              location.href = "/h5/views/main/index.html";
                            }
                          },
                          {
                            value: "去开户",
                            callback: function() {
                              location.href =
                                "/h5/views/account/settings/bankcardToBind.html?redirectURL=/h5/views/main/index.html";
                            }
                          }
                        ]
                      });
                    } else {
                      jumi.tips(data.msg);
                      that.clickstatus = true;
                    }
                  }
                });
              }
            }
          },
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
          ///倒计时
          countdown: function() {
            var that = this;
            clearInterval(that.setIntervalID);
            var thiz = $("#getCodeButtonMask");
            var time = 60;
            thiz.addClass("disabled");
            that.setIntervalID = setInterval(function() {
              time--;
              thiz.html("获取验证码（" + time + "）");
              if (time == 0) {
                clearInterval(that.setIntervalID);
                time = 60;
                thiz.removeClass("disabled").html("获取验证码");
                LUOCAPTCHA.reset();
              }
            }, 1000);
          }
        }
      }
    },
    ready: function() {
      $("#myloading").remove();
      //分享
      weixin
        .setTitle()
        .setDesc()
        .setImg()
        .setUrl()
        .share();
    }
  });
});
