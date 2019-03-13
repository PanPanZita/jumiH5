define([
  "nav",
  "bigwheel",
  "asyncload",
  "weixin",
  "isLogin",
  "isLoginwx",
  "getPara",
  "vue"
], function(
  nav,
  bigwheel,
  asyncload,
  weixin,
  isLogin,
  isLoginwx,
  getPara,
  vue
) {
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  // console.log(parainit);
  var para = getPara.get();
  if (para.from) {
    // 是分享出来的链接,
    var locationCodepar = location.href.split("&code=")[1];
  } else {
    var locationCodepar = location.href.split("?code=")[1];
  }
  $.ajax({
    url: "/activity/getTurnTableIndex",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      if (data.code == "0000") {
        new vue({
          el: "body",
          components: {
            "my-wheel": {
              template: "#wheelTemplate",
              data: function() {
                return {
                  data: data.data,
                  awardList: data.data.jmAwardList,
                  freetimes: data.data.freeTimes,
                  isIOSShow: localStorage.fromapp == "ios" //为IOS通过官方审核而用
                };
              },
              methods: {
                toLogin: function() {
                  if (!locationCodepar) {
                    isLogin();
                  }
                },
                viewshistory: function() {
                  if (!locationCodepar) {
                    isLogin(function() {
                      location.href = "/h5/views/wheel/wheelRecord.html";
                    });
                  }
                }
              }
            }
          },
          ready: function() {
            // 自动登陆
            if (locationCodepar) {
              var locationCode = locationCodepar.split("&state=")[0];
              isLoginwx(locationCode, "/h5/views/wheel/wheel.html");
            }

            var that = this;
            nav.setActiveNav("discover");
            $(".async").asyncload();
            $("#myloading").remove();

            /////////////////////////////////////////////////////////////////////////////大转盘
            $("#wheelBox").luckDraw({
              width: "25", //宽
              height: "25", //高
              line: 3, //几行
              list: 3, //几列
              click: ".wheel-start", //点击对象
              callback: function(data) {
                console.log(data);
                that.$children[0].freetimes = data.data.freetimes;
              }
            });

            //分享
            weixin
              .setTitle("聚米众筹天天转盘，富力转不停")
              .setDesc()
              .setImg()
              .setUrl(location.origin + "/h5/views/wheel/wheel.html")
              .share();
          }
        });
      }
    }
  });
});
