define(["jumi", "vue", "isLogin", "isLoginwx", "getPara", "weixin"], function(
  jumi,
  vue,
  isLogin,
  isLoginwx,
  getPara,
  weixin
) {
  var para = getPara.get();
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  isLogin(function() {
    new vue({
      el: "body",
      components: {
        "my-sex": {
          template: "#sexTemplate",
          data: function() {
            return {
              data: para,
              selected: para.sex,
              options: [{ text: "男", value: "1" }, { text: "女", value: "0" }]
            };
          },
          methods: {
            save: function() {
              var parasex = {
                sex: this.selected,
                token: token,
                requestSource: "WAP"
              };

              $.ajax({
                type: "post",
                url: "/userCenter/setting/updateUser",
                data: parasex,
                dataType: "json",
                success: function(data) {
                  if (data.code == "0000") {
                    location.href = "/h5/views/account/settings/personal.html";
                  }
                }
              });
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
  }); //isLogin的结束
  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
