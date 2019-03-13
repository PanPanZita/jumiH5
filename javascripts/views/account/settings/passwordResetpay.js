define([
  "jumi",
  "vue",
  "getPara",
  "autoHeight",
  "numberboard",
  "isLogin",
  "isLoginwx",
  "md5",
  "weixin"
], function(
  jumi,
  vue,
  getPara,
  autoHeight,
  numberboard,
  isLogin,
  isLoginwx,
  md5,
  weixin
) {
  var para = getPara.get();
  isLogin(function() {
    var vm = new vue({
      el: "body",
      components: {
        "my-passwordreset": {
          template: "#passwordResetTemplate",
          data: function() {
            return {
              userpwdreal: "",
              userconfirmpwdreal: ""
            };
          },
          methods: {
            highlight: function() {
              var patrn_null = /^\S{0}$/; //非空
              var userpwdrealproving =
                $("#userpwdreal").attr("proving") == 1 ? 1 : 0;
              var userconfirmpwdrealproving =
                $("#userconfirmpwdreal").attr("proving") == 1 ? 1 : 0;
              var boolNull =
                !patrn_null.test(this.userpwdreal) &&
                !patrn_null.test(this.userconfirmpwdreal);
              var boolproving = userpwdrealproving && userconfirmpwdrealproving;
              if (boolNull && boolproving) {
                $(".button-fill.button.disabled").removeClass("disabled");
              } else {
                $(".button-fill.button").addClass("disabled");
              }
            },
            userpwdrealKeyup: function() {
              var patrn_number = /^[0-9]*$/; //纯数字
              if (!patrn_number.test(this.userpwdreal)) {
                $("#userpwdreal").attr("proving", 0);
                jumi.tips("支付密码格式错误！");
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
              var paraconfirm = {
                phone: para.phone,
                password: md5(this.userpwdreal).toLocaleUpperCase(),
                confirmPassword: md5(
                  this.userconfirmpwdreal
                ).toLocaleUpperCase(),
                pwdType: "paypassword",
                requestSource: "WAP"
              };
              // console.log(paraconfirm);
              $.ajax({
                url: "/common/getBackPassword",
                type: "post",
                dataType: "json",
                data: paraconfirm,
                success: function(data) {
                  // console.log(data);
                  if (data.code == "0000") {
                    jumi.alert({
                      title: "聚小米提醒您",
                      content: "找回支付密码成功~",
                      button: [
                        {
                          value: "知道了",
                          callback: function() {
                            location.href =
                              "/h5/views/account/settings/safe.html";
                          }
                        }
                      ]
                    });
                  } else {
                    jumi.tips(data.msg);
                  }
                },
                error: function(msg) {
                  console.log(msg);
                }
              });
            }
          }
        }
      },
      ready: function() {
        $("#myloading").remove();
        autoHeight.setHeight();

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
  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
