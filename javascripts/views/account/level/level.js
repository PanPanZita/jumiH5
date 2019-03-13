define(["nav", "isLogin", "isLoginwx", "vue", "weixin"], function(
  nav,
  isLogin,
  isLoginwx,
  vue,
  weixin
) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/setting/getMenmbershipLevel",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-level": {
                template: "#levelTemplate",
                data: function() {
                  return {
                    widthprocess: "",
                    data: data.data,
                    jmMembershipLevel: data.data.jmMembershipLevel
                  };
                }
              }
            },
            ready: function() {
              var that = this;
              nav.setActiveNav("account");
              $("#myloading").remove();
              if (that.$children[0].data.requirement) {
                var widthprocess =
                  parseInt(that.$children[0].data.border) /
                  parseInt(that.$children[0].data.requirement);
                that.$children[0].widthprocess = widthprocess * 100;
                if (that.$children[0].widthprocess >= 100) {
                  that.$children[0].widthprocess = 100;
                }
              } else {
                var widthprocess =
                  parseInt(that.$children[0].data.border) /
                  parseInt(that.$children[0].jmMembershipLevel.requirement);
                that.$children[0].widthprocess = widthprocess * 100;
                if (that.$children[0].widthprocess >= 100) {
                  that.$children[0].widthprocess = 100;
                }
              }
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
  }); //isLogin的结束
  //   微信登陆--该链接后面不带参数
  var url = location.href.split("?code=")[0];
  var locationCodepar = location.href.split("?code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
