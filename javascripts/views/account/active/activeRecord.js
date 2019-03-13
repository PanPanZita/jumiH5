define([
  "jumi",
  "tab",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin",
  "load",
  "scrolltotop"
], function(jumi, tab, isLogin, isLoginwx, vue, weixin, load, scrolltotop) {
  var token = localStorage.getItem("token");
  var parainit = {
    currentPage: 1,
    pageSize: 10,
    token: token,
    sourceType: null, // 默认加载全部
    orderStatus: null, // 默认加载全部
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/personalCenter/myorderlist",
      type: "get",
      // dataType: "json",
      data: parainit,
      success: function(data) {
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-active": {
                template: "#activeTemplate",
                data: function() {
                  return {
                    currentPageRepay: 1,
                    currentStatus: -1,
                    currentSourceType: -1,
                    listSum: {
                      items: data.data,
                      currentPage: 1,
                      isLoading: 0
                    },
                    isIOSShow: localStorage.fromapp == "ios" // 为 IOS 通过官方审核而用
                  };
                },
                methods: {
                  goOrigin: function(sourceType, actionType, itemId) {
                    switch (sourceType) {
                      case 0:
                        location.href =
                          "/h5/views/invest/invest.html?itemId=" + itemId;
                        break;
                      case 1:
                        if (actionType == 1) {
                          location.href = "/h5/views/wheel/wheel.html";
                        } else {
                          location.href =
                            "/h5/views/topic/topicDetail.html?action_id=" +
                            itemId;
                        }
                        break;
                      default:
                        break;
                    }
                  },
                  goDetail: function(orderId) {
                    // 立即确认，跳转详情页面
                    location.href =
                      "/h5/views/account/active/activeDetail.html?orderId=" +
                      orderId;
                  },
                  loadDataz: function() {
                    var that = this;
                    // 切换筛选条件时，调用一次
                    $.ajax({
                      url: "/userCenter/personalCenter/myorderlist",
                      type: "get",
                      // dataType: "json",
                      data: {
                        currentPage: 1,
                        pageSize: 10,
                        token: token,
                        sourceType:
                          that.currentSourceType == -1
                            ? null
                            : that.currentSourceType,
                        orderStatus:
                          that.currentStatus == -1 ? null : that.currentStatus,
                        requestSource: "WAP"
                      },
                      success: function(data) {
                        if (data.code == "0000") {
                          that.listSum.items = data.data;
                        } else {
                          jumi.tips(data.msg);
                        }
                      },
                      error: function(error) {
                        console.error(error);
                      }
                    });
                  },
                  sureHave: function(argus) {
                    // 确认收货
                    jumi.alert({
                      skin: "buttonz",
                      fixed: true,
                      content: "确认收货？",
                      button: [
                        {
                          value: "取消"
                        },
                        {
                          value: "收货",
                          callback: function() {
                            $.ajax({
                              data: {
                                token: token,
                                orderId: argus,
                                requestSource: "WAP"
                              },
                              url:
                                "/userCenter/personalCenter/checkOrderStatus",
                              type: "post",
                              dataType: "json",
                              success: function(res) {
                                if (res.code == "0000") {
                                  // 确认成功
                                  location.reload();
                                } else {
                                  jumi.tips(res.msg);
                                }
                              },
                              error: function(error) {
                                console.error(error);
                              }
                            });
                          }
                        }
                      ]
                    });
                  },
                  deleteOrder: function(argus) {
                    // 删除订单
                    jumi.alert({
                      skin: "buttonz",
                      fixed: true,
                      content: "确认删除订单",
                      button: [
                        {
                          value: "取消"
                        },
                        {
                          value: "删除",
                          callback: function() {
                            $.ajax({
                              data: {
                                token: token,
                                orderId: argus,
                                requestSource: "WAP"
                              },
                              url: "/userCenter/personalCenter/deleteorder",
                              type: "post",
                              dataType: "json",
                              success: function(res) {
                                if (res.code == "0000") {
                                  // 删除成功
                                  location.reload();
                                } else {
                                  jumi.tips(res.msg);
                                }
                              },
                              error: function(error) {
                                console.error(error);
                              }
                            });
                          }
                        }
                      ]
                    });
                  }
                },
                watch: {
                  currentStatus: function() {
                    this.currentPageRepay = 1;
                    $("#loadMoreButton1").html(
                      '<i class="iconfont">&#xe65d;</i> <span>上拉刷新数据</span>'
                    );
                    this.loadDataz();
                    this.listSum.items = [];
                  },
                  currentSourceType: function() {
                    this.currentPageRepay = 1;
                    $("#loadMoreButton1").html(
                      '<i class="iconfont">&#xe65d;</i> <span>上拉刷新数据</span>'
                    );
                    this.loadDataz();
                    this.listSum.items = [];
                  }
                },
                filters: {
                  timeFilter: function(timeStampz) {
                    var time = new Date(timeStampz);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    m = m < 10 ? "0" + m : m;
                    var d = time.getDate();
                    d = d < 10 ? "0" + d : d;
                    return y + "-" + m + "-" + d;
                  },
                  statusFilter: function(status) {
                    switch (status) {
                      case 0:
                        return "待支付";
                        break;
                      case 1:
                        return "待确认";
                        break;
                      case 2:
                        return "待发货";
                        break;
                      case 6:
                        return "待收货";
                        break;
                      case 3:
                        return "已完成";
                        break;
                      default:
                        return "--";
                        break;
                    }
                  }
                }
              }
            },
            ready: function() {
              var that = this;
              $("#myloading").remove();
              weixin
                .setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();
              // 上拉刷新-加载更多记录(全部)
              load.pullup({
                el: "#tabs1",
                button: "#loadMoreButton1",
                callback: function(options) {
                  var component = that.$children[0];
                  component.currentPageRepay++;
                  var paraload = {
                    token: token,
                    sourceType:
                      component.currentSourceType == -1
                        ? null
                        : component.currentSourceType,
                    orderStatus:
                      component.currentStatus == -1
                        ? null
                        : component.currentStatus,
                    pageSize: 10,
                    currentPage: component.currentPageRepay,
                    requestSource: "WAP"
                  };
                  $.ajax({
                    url: "/userCenter/personalCenter/myorderlist",
                    type: "get",
                    data: paraload,
                    success: function(data) {
                      if (data.code == "0000") {
                        if (
                          data.data instanceof Array &&
                          data.data.length > 0
                        ) {
                          for (var i = 0; i < data.data.length; i++) {
                            component.listSum.items.push(data.data[i]);
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
              }); // end load
            }
          });
        } else {
          jumi.tips(data.msg);
        }
      }
    });
  }); // isLogin的结束
  // 微信登陆--该链接后面不带参数
  var url = location.href.split("?code=")[0];
  var locationCodepar = location.href.split("?code=")[1];
  if (locationCodepar) {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }
});
