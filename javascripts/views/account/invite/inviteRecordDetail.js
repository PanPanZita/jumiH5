define([
  "nav",
  "tab",
  "vue",
  "scrolltotop",
  "getPara",
  "isLogin",
  "isLoginwx",
  "asyncload",
  "weixin",
  "jumi",
  "load"
], function(
  nav,
  tab,
  vue,
  scrolltotop,
  getPara,
  isLogin,
  isLoginwx,
  asyncload,
  weixin,
  jumi,
  load
) {
  var outpara = getPara.get();
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP",
    userId: outpara.userId,
    currentPage: 1,
    pageSize: 10
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/inviteFriend/getInvestRecord",
      type: "get",
      data: parainit,
      dataType: "json",
      success: function(data) {
        if (data.code == "0000") {
          if (data.data != null) {
            new vue({
              el: "body",
              components: {
                "my-record": {
                  template: "#recordTemplate",
                  data: function() {
                    return {
                      data: data,
                      items: data.data.investList,
                      currentPage: 1,
                      pageSize: 10,
                      isLoading: 0
                    };
                  }
                }
              },
              ready: function() {
                var that = this;
                nav.setActiveNav("account");
                $("#myloading").remove();

                //分享
                weixin
                  .setTitle()
                  .setDesc()
                  .setImg()
                  .setUrl()
                  .share();

                //上拉刷新-加载更多记录
                load.pullup({
                  button: "#loadMoreButton",
                  callback: function(options) {
                    var component = that.$children[0];

                    options.currentPage++;

                    var paraload = {
                      token: token,
                      userId: outpara.userId,
                      pageSize: 10,
                      currentPage: options.currentPage,
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/userCenter/inviteFriend/getInvestRecord",
                      type: "post",
                      dataType: "json",
                      data: paraload,
                      success: function(data) {
                        if (data.code == "0000") {
                          if (
                            data.data != null &&
                            data.data.investList != null &&
                            data.data.investList.length > 0
                          ) {
                            for (
                              var i = 0;
                              i < data.data.investList.length;
                              i++
                            ) {
                              component.items.push(data.data.investList[i]);
                            }
                            options.isLoading = 0;
                          } else {
                            options.isLoading = 2;
                            $(options.button).html("-- 我已倾囊相授 --");
                          }
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        } else {
          jumi.tips(data.msg);
        }
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
