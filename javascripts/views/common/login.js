define([
  "jumi",
  "vue",
  "autoHeight",
  "regexp",
  "md5",
  "getPara",
  "weixin"
], function(jumi, vue, autoHeight, regexp, md5, getPara, weixin) {
  var para = getPara.get();

  new vue({
    el: "body",
    components: {
      "my-login": {
        template: "#loginTemplate",
        data: function() {
          return {
            mobile: "",
            password: "",
            isShowHide: true
          };
        },
        methods: {
          toShowHide: function() {
            var bool1 = regexp.validate("null", this.mobile);
            var bool2 = regexp.validate("null", this.password);
            var bool3 = !regexp.validate("mobile", this.mobile);
            var bool4 = !regexp.validate("length", "6,16", this.password);
            // alert(this.mobile);

            if (bool1 || bool2 || bool3 || bool4) {
              this.isShowHide = true;
            } else {
              this.isShowHide = false;
            }
          },
          inputMobileBlur: function() {
            var bool1 = regexp.validate("null", this.mobile);
            var bool2 = !regexp.validate("mobile", this.mobile);

            if (bool1) return;
            if (bool2) {
              jumi.tips("手机号码格式不正确！");
              return;
            }
            var para = {
              phone: this.mobile,
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
                    jumi.tips("该手机号尚未注册，请先注册");
                  }
                } else {
                  jumi.tips(data.msg);
                }
              }
            });
            // alert(this.mobile);
            this.toShowHide();
          },
          inputMobileKeyup: function() {
            this.toShowHide();
          },
          inputPasswordBlur: function() {
            // alert(this.password);
            this.toShowHide();
          },
          inputPasswordKeyup: function() {
            var bool1 = regexp.validate("null", this.password);
            var bool2 = !regexp.validate("length", "6,16", this.password);

            if (bool1) return;
            if (bool2) this.password = this.password.substring(0, 16);
            this.toShowHide();
          },
          toLogin: function() {
            var para = {
              phone: this.mobile,
              password: md5(this.password).toLocaleUpperCase(),
              requestSource: "WAP"
            };
            // console.log(para);
            $.ajax({
              url: "/login/login",
              type: "post",
              data: para,
              dataType: "json",
              success: function(data) {
                // console.log(data);
                if (data.code === "0000") {
                  localStorage.setItem("token", data.data.token);
                  location.href = "/h5/views/main/index.html";
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
      autoHeight.setHeight();
      document.getElementById("mobile").focus();
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
