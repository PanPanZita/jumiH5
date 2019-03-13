define([
  "nav",
  "tab",
  "vue",
  "scrolltotop",
  "isLogin",
  "isLoginwx",
  "asyncload",
  "weixin",
  "load"
], function(
  nav,
  tab,
  vue,
  scrolltotop,
  isLogin,
  isLoginwx,
  asyncload,
  weixin,
  load
) {
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP",
    currentPage: 1,
    pageSize: 10
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/inviteFriend/getInviteRecordList",
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
                      items: data.data,
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
                      loadType: "1",
                      token: token,
                      pageSize: 10,
                      currentPage: options.currentPage,
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/userCenter/inviteFriend/getInviteRecordList",
                      type: "post",
                      dataType: "json",
                      data: paraload,
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          if (data.data != null && data.data.length > 0) {
                            for (var i = 0; i < data.data.length; i++) {
                              component.items.push(data.data[i]);
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
