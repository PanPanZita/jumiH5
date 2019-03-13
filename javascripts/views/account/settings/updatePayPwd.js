define([
  "jumi",
  "nav",
  "vue",
  "numberboard",
  "isLogin",
  "isLoginwx",
  "md5",
  "weixin"
], function(jumi, nav, vue, numberboard, isLogin, isLoginwx, md5, weixin) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  isLogin(function() {
    new vue({
      el: "body",
      components: {
        "my-updatepaypwd": {
          template: "#updatePayPwdTemplate",
          data: function() {
            return {
              userpwdrealoriginal: "",
              userpwdreal: "",
              userconfirmpwdreal: ""
            };
          },
          methods: {
            highlight: function() {
              var patrn_null = /^\S{0}$/; //非空
              var userpwdrealoriginalproving =
                $("#userpwdrealoriginal").attr("proving") == 1 ? 1 : 0;
              var userpwdrealproving =
                $("#userpwdreal").attr("proving") == 1 ? 1 : 0;
              var userconfirmpwdrealproving =
                $("#userconfirmpwdreal").attr("proving") == 1 ? 1 : 0;
              var boolNull =
                !patrn_null.test(this.userpwdrealoriginal) &&
                !patrn_null.test(this.userpwdreal) &&
                !patrn_null.test(this.userconfirmpwdreal);
              var boolproving =
                userpwdrealoriginalproving &&
                userpwdrealproving &&
                userconfirmpwdrealproving;
              if (boolNull && boolproving) {
                $(".button-fill.button.disabled").removeClass("disabled");
              } else {
                $(".button-fill.button").addClass("disabled");
              }
            },
            userpwdrealoriginalKeyup: function() {
              var patrn_number = /^[0-9]*$/; //纯数字
              if (!patrn_number.test(this.userpwdrealoriginal)) {
                $("#userpwdrealoriginal").attr("proving", 0);
                jumi.tips("支付密码应为6位数字");
                return;
              }
              if (this.userpwdrealoriginal.length == 6) {
                $("#userpwdrealoriginal").attr("proving", 1);
              } else {
                $("#userpwdrealoriginal").attr("proving", 0);
              }
              this.highlight();
            },
            userpwdrealKeyup: function() {
              var patrn_number = /^[0-9]*$/; //纯数字
              if (!patrn_number.test(this.userpwdreal)) {
                $("#userpwdreal").attr("proving", 0);
                jumi.tips("支付密码应为6位数字");
                return;
              }
              if (this.userpwdreal.length == 6) {
                $("#userpwdreal").attr("proving", 1);
              } else {
                $("#userpwdreal").attr("proving", 0);
              }
              this.highlight();
            },
            userconfirmpwdrealKeyup: function() {
              var confirmpwdlen = this.userconfirmpwdreal.length;
              if (confirmpwdlen == 6) {
                if (this.userconfirmpwdreal == this.userpwdreal) {
                  $("#userconfirmpwdreal").attr("proving", 1);
                } else {
                  $("#userconfirmpwdreal").attr("proving", 0);
                  jumi.tips("两次新密码输入不一致");
                }
              } else {
                $("#userconfirmpwdreal").attr("proving", 0);
              }
              this.highlight();
            },
            ok: function() {
              var that = this;
              var para = {
                password: md5(that.userpwdrealoriginal).toLocaleUpperCase(),
                newPassword: md5(that.userpwdreal).toLocaleUpperCase(),
                confirmPassword: md5(
                  that.userconfirmpwdreal
                ).toLocaleUpperCase(),
                pwdType: "paypassword",
                token: token,
                requestSource: "WAP"
              };
              // console.log(that.userpwdrealoriginal);
              // console.log(that.userpwdreal);
              // console.log(that.userconfirmpwdreal);
              $.ajax({
                url: "/userCenter/setting/updatePasswordOrPayPassword",
                type: "post",
                dataType: "json",
                data: para,
                success: function(data) {
                  // console.log(data);
                  if (data.code == "0000") {
                    location.href = "/h5/views/account/settings/safe.html";
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
        nav.setActiveNav("account");
        $("#myloading").remove();
        numberboard.init("userpwdrealoriginal");
        numberboard.init("userpwdreal");
        numberboard.init("userconfirmpwdreal");
        //分享
        weixin
          .setTitle()
          .setDesc()
          .setImg()
          .setUrl()
          .share();
      }
    });
  }); //isLogin的结束
  //   微信登陆--该链接后面不带参数
  var url = location.href.split("?code=")[0];
  var locationCodepar = location.href.split("?code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
