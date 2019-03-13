define([
  "jumi",
  "nav",
  "isLogin",
  "isLoginwx",
  "vue",
  "getPara",
  "weixin"
], function(jumi, nav, isLogin, isLoginwx, vue, getPara, weixin) {
  var para = getPara.get();
  var token = localStorage.getItem("token");

  new vue({
    el: "body",
    components: {
      "my-unbinding": {
        template: "#unbindingTemplate",
        data: function() {
          return {
            phone: para.phone,
            phoneCode: "",
            codeBtndisabled: false, //控制是否可被点击
            countTime: 60,
            flagVoice: true, //获取语音验证码是否可点击(控制5s之后才可以再次请求获取语音验证码接口)
            setIntervalCode: null
          };
        },
        methods: {
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
            var paragetcode = {
              phone: para.phone
            };
            $.ajax({
              url: "/common/authcode/getPhoneCode",
              type: "post",
              dataType: "json",
              data: paragetcode,
              success: function(data) {
                // console.log(data);
                if (data.code == "0000") {
                  jumi.tips("验证码发送成功，请注意查收...");
                  clearInterval(that.setIntervalCode);
                  that.codeBtndisabled = true;
                  that.setIntervalCode = setInterval(function() {
                    that.countTime--;
                    $(".getCode").html(that.countTime + "s");
                    if (that.countTime <= 0) {
                      clearInterval(that.setIntervalCode);
                      that.countTime = 60;
                      //获取验证码亮起来
                      $(".getCode").html("重新获取");
                      that.codeBtndisabled = false;
                    }
                  }, 1000);
                } else {
                  jumi.tips(data.msg);
                }
              }
            });
          },
          next: function() {
            var that = this;
            var paraunbind = {
              phone: para.phone,
              phoneCode: that.phoneCode,
              token: token,
              requestSource: "WAP"
            };
            $.ajax({
              url: "/userCenter/userAccount/unbindCard",
              type: "post",
              dataType: "json",
              data: paraunbind,
              success: function(data) {
                // console.log(data);
                if (data.code == "0000") {
                  // 本地银行卡记录小于2跳转到绑卡流程，否则跳转到银行卡列表页面
                  if (data.data < 2) {
                    location.href =
                      "/h5/views/account/settings/bankcardToBindAndCashout.html";
                  } else {
                    location.href = "/h5/views/account/settings/banklist.html";
                  }
                } else {
                  jumi.tips(data.msg);
                }
              }
            });
          },
          cancel: function() {
            location.href =
              "/h5/views/account/settings/bankcardToShow.html?redirectURL=/h5/views/account/account.html";
          }
        },
        computed: {
          phoneStr: function() {
            var that = this;
            return that.phone.substr(0, 3) + "****" + that.phone.substr(7, 4);
          }
        }
      }
    },
    ready: function() {
      $("#myloading").remove();

      var that = this;
      jumi.tips("验证码发送成功，请注意查收...");
      clearInterval(that.$children[0].setIntervalCode);
      that.$children[0].codeBtndisabled = true;
      that.$children[0].setIntervalCode = setInterval(function() {
        that.$children[0].countTime--;
        $(".getCode").html(that.$children[0].countTime + "s");
        if (that.$children[0].countTime <= 0) {
          clearInterval(that.$children[0].setIntervalCode);
          that.$children[0].countTime = 60;
          //获取验证码亮起来
          $(".getCode").html("重新获取");
          that.$children[0].codeBtndisabled = false;
        }
      }, 1000);
    }
  });

  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
