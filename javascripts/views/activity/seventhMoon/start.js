define([
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin",
  "getPara",
  "screenControl"
], function(isLogin, isLoginwx, vue, weixin, getPara, screenControl) {
  var para = getPara.get();
  new vue({
    el: "body",
    components: {
      "my-start": {
        template: "#startTemplate",
        data: function() {
          return {
            isShare: "noShare" // 是否是分享出来的链接
          };
        },
        methods: {
          hrefReport: function() {
            isLogin(function() {
              location.href = "/h5/views/activity/seventhMoon/report.html";
            });
            e.preventDefault();
          }
        }
      }
    },
    ready: function() {
      $("#myloading").remove();
      var that = this;

      if (para.from) {
        that.$children[0].isShare = "share";
      }

      if (para.invitorUserId) {
        //该链接后面带有参数invitorUserId
        var locationCodepar = location.href.split("&code=")[1];
        if (locationCodepar) {
          var locationCode = locationCodepar.split("&state=")[0];
          isLoginwx(
            locationCode,
            "/h5/views/activity/seventhMoon/report.html?invitorUserId=" +
              para.invitorUserId
          );
        }
      } else if (that.$children[0].isShare == "share") {
        var locationCodepar = location.href.split("&code=")[1];
        if (locationCodepar) {
          var locationCode = locationCodepar.split("&state=")[0];
          isLoginwx(locationCode, "/h5/views/activity/seventhMoon/report.html");
        }
      } else {
        var locationCodepar = location.href.split("?code=")[1];
        if (locationCodepar) {
          var locationCode = locationCodepar.split("&state=")[0];
          isLoginwx(locationCode, "/h5/views/activity/seventhMoon/report.html");
        }
      }

      //分享
      var o = {
        title: "一份来自聚小米的情书",
        desc: "等我遇见你，点亮你的自由人生。",
        img:
          "https://jumifinancetest.oss-cn-hangzhou.aliyuncs.com/itemDetail/1533784371641002350.jpg",
        url: location.origin + "/h5/views/activity/seventhMoon/start.html"
      };

      weixin
        .setTitle(o.title)
        .setDesc(o.desc)
        .setImg(o.img)
        .setUrl(o.url)
        .share();
    }
  }); //end vue
});
