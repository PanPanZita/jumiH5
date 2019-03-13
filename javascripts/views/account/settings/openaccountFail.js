define([
  "jumi",
  "nav",
  "vue",
  "isLogin",
  "isLoginwx",
  "getPara",
  "weixin"
], function(jumi, nav, vue, isLogin, isLoginwx, getPara, weixin) {
  var para = getPara.get();
  var errorMessage = decodeURI(para.errorMessage);
  isLogin(function() {
    new vue({
      el: "body",
      components: {
        "my-openaccount": {
          template: "#openaccountTemplate",
          data: function() {
            return {
              errorMessage: errorMessage
            };
          },
          methods: {
            personInfo: function() {
              location.href = "/h5/views/account/account.html";
            },
            reopen: function() {
              location.href =
                "/h5/views/account/settings/bankcardToBind.html?redirectURL=" +
                para.redirectURL;
            }
          }
        }
      },
      ready: function() {
        nav.setActiveNav("account");
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
  }); //isLogin的结束
  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
