define([
  "jumi",
  "nav",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin",
  "load",
  "scrolltotop"
], function(jumi, nav, isLogin, isLoginwx, vue, weixin, load, scrolltotop) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  var parainit = {
    token: token,
    requestSource: "WAP",
    pageSize: 10,
    currentPage: 1
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/userAccount/getMyCashList",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-list": {
                template: "#listTemplate",
                data: function() {
                  return {
                    lists: data.data.cashList,
                    pageSize: 10,
                    currentPage: 1,
                    isLoading: 0
                  };
                },
                methods: {
                  //取消提现
                  cancelCashout: function(id, index) {
                    var that = this;
                    var paracancel = {
                      cashId: id,
                      token: token,
                      requestSource: "WAP"
                    };
                    jumi.alert({
                      title: "温馨提示",
                      skin: "ui-dialog-bankcard",
                      content: "确认取消提现？",
                      button: [
                        {
                          value: "确认",
                          callback: function() {
                            $.ajax({
                              url: "/userCenter/userAccount/cancleCash",
                              type: "post",
                              dataType: "json",
                              data: paracancel,
                              success: function(data) {
                                // console.log(data);
                                if (data.code == "0000") {
                                  // splice的第二个元素为1表示删除
                                  // for(key in that.lists){
                                  //  if(that.lists[key].id == id){
                                  //      that.lists.splice(key,1,data.accountCash);
                                  //  }
                                  // }
                                  jumi.tips("取消提现成功！");
                                  //   location.reload();   有Bug,部分安卓手机不能刷新，例如小米手机
                                  that.lists[index].status = 2;
                                  that.lists[index].statusShow = "用户取消";
                                } else {
                                  jumi.tips(data.msg);
                                  setTimeout(function() {
                                    window.location.href =
                                      location.href +
                                      "?time=" +
                                      new Date().getTime();
                                  }, 2500);
                                }
                              }
                            });
                          }
                        },
                        {
                          value: "取消"
                        }
                      ]
                    });
                  }
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
                    pageSize: 10,
                    currentPage: options.currentPage,
                    token: token,
                    requestSource: "WAP"
                  };
                  $.ajax({
                    url: "/userCenter/userAccount/getMyCashList",
                    type: "post",
                    dataType: "json",
                    data: paraload,
                    success: function(data) {
                      if (data.code == "0000") {
                        if (
                          data.data != null &&
                          data.data.cashList != null &&
                          data.data.cashList.length > 0
                        ) {
                          for (var i = 0; i < data.data.cashList.length; i++) {
                            component.lists.push(data.data.cashList[i]);
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
          }); //vue end
        } else {
          jumi.tips(data.msg);
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
