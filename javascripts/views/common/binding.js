define(["jumi", "vue", "getPara", "wxBackbtn"], function(
  jumi,
  vue,
  getPara,
  wxBackbtn
) {
  var para = getPara.get();
  var paraRedirectUrl = location.href.split("&redirectUrl=")[1]; //   /h5/views/activity/seventhMoon/report.html?invitorUserId=20171729
  var paraInvitorUserId = paraRedirectUrl.split("?invitorUserId=")[1]; //20171729
  var itemFlag = localStorage.getItem("itemFlag")
    ? localStorage.getItem("itemFlag")
    : "no";
  //   alert("绑定页面的页面的itemFlag" + itemFlag);
  new vue({
    el: "body",
    components: {
      "my-binding": {
        template: "#bindingTemplate",
        data: function() {
          return {
            headImageUrl: para.headImageUrl,
            nickName: decodeURI(para.nickName),
            phone: "",
            phoneCode: "",
            countTime: 60,
            setIntervalCode: null,
            flagVoice: true, //获取语音验证码是否可点击(控制5s之后才可以再次请求获取语音验证码接口)
            sliderSuccess: false //滑动是否通过
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
              $(".goBinding").removeAttr("disabled");
              $(".goBinding").removeClass("disabled");
            } else {
              //不符合规则
              $(".goBinding").attr("disabled", "disabled");
              $(".goBinding").addClass("disabled");
            }
          },
          phoneCode: function(nweVal, oldVal) {
            var rePhone = /^1\d{10}$/;
            var rePhoneCode = /^\d{4}$/;
            var boolPhone = rePhone.test(this.phone);
            var boolPhoneCode = rePhoneCode.test(this.phoneCode);
            if (boolPhone && boolPhoneCode) {
              //同时符合规则
              $(".goBinding").removeAttr("disabled");
              $(".goBinding").removeClass("disabled");
            } else {
              //不符合规则
              $(".goBinding").attr("disabled", "disabled");
              $(".goBinding").addClass("disabled");
            }
          }
        },
        methods: {
          inputPhoneKeyup: function() {
            var rePhone = /^1\d{10}$/;
            if (rePhone.test(this.phone) && !this.sliderSuccess) {
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
          goBinding: function() {
            var invitorUserId = paraInvitorUserId ? paraInvitorUserId : "";
            var params = {
              phone: this.phone,
              phoneCode: this.phoneCode,
              openId: para.openId,
              unionId: para.unionId,
              requestSource: "WAP",
              itemLabel: itemFlag, //项目是否带标签
              invitorUserId: invitorUserId //来源：七夕活动
            };
            $.ajax({
              url: "/weixin/bindWeixin",
              type: "post",
              data: params,
              dataType: "json",
              success: function(data) {
                // console.log(data);
                if (data.code == "0000") {
                  localStorage.setItem("token", data.data.token);
                  if (paraInvitorUserId) {
                    //如果是七夕活动过来的,并且携带参数（写这个判断语句，是因为不想让url被污染，真正进入到report页面的时候是不携带参数的）
                    location.href = paraRedirectUrl.split("?invitorUserId=")[0];
                  } else {
                    location.href = location.href.split("&redirectUrl=")[1];
                  }
                } else {
                  jumi.tips(data.msg);
                }
              }
            });
          }
        }
      }
    },
    ready: function() {
      $("#myloading").remove();
      if (paraRedirectUrl == "/h5/views/activity/midAutumn.html") {
        wxBackbtn.setReturnUrl(); //控制微信浏览器的返回按钮
      }
    }
  });
});
