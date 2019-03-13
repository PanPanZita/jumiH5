define([
  "jumi",
  "nav",
  "tab",
  "vue",
  "getPara",
  "scrolltotop",
  "isLogin",
  "isLoginwx",
  "asyncload",
  "weixin",
  "load"
], function(
  jumi,
  nav,
  tab,
  vue,
  getPara,
  scrolltotop,
  isLogin,
  isLoginwx,
  asyncload,
  weixin,
  load
) {
  var token = localStorage.getItem("token");
  var para = getPara.get();
  var parainit = {
    currentPage: 1,
    pageSize: 10,
    token: token,
    requestSource: "WAP"
  };
  if (para.from) {
    // 是分享出来的链接,
    var locationCodepar = location.href.split("&code=")[1];
  } else {
    var locationCodepar = location.href.split("?code=")[1];
  }
  if (!locationCodepar) {
    isLogin(function() {
      $.ajax({
        url: "/userCenter/investBill/getInvestBillList",
        type: "post",
        dataType: "json",
        data: parainit,
        success: function(data) {
          // console.log(data);
          if (data.code == "0000") {
            new vue({
              el: "body",
              components: {
                "my-invest": {
                  template: "#investTemplate",
                  data: function() {
                    return {
                      currentPageRepay: 1,
                      statusCash: 0,
                      timeType: 0,
                      up: true, //兑付时间升序
                      repayBillList: {
                        items: data.data.repayBillList,
                        currentPage: 1,
                        pageSize: 10,
                        isLoading: 0
                      },
                      noRepayBillList: {
                        items: data.data.noRepayBillList,
                        currentPage: 1,
                        pageSize: 10,
                        isLoading: 0
                      },
                      getHbList: [], //分享记录列表弹框
                      isShow: false, //分享红包弹出框显示
                      shareIntroducer: "", //后台配置的引导语
                      shareItemname: "" //分享弹出框的项目名字
                    };
                  },
                  methods: {
                    selectProfitInit: function() {
                      //   根据条件展示页面
                      var that = this;
                      var params = {
                        token: token,
                        pageSize: 10,
                        currentPage: 1,
                        costType: 1, //1 收益；0 实物
                        statusCash: that.statusCash, //兑付状态(0:未兑付，1：已兑付 ,2:兑付中)
                        timeType: that.timeType, //排序类型(0:支持时间降序 1:兑付时间升序 2:兑付时间降序)
                        requestSource: "WAP"
                      };
                      $.ajax({
                        url: "/userCenter/investBill/getInvestBillList",
                        type: "post",
                        dataType: "json",
                        data: params,
                        success: function(data) {
                          // console.log(data);
                          if (data.code == "0000") {
                            if (
                              data.data != null &&
                              data.data.repayBillList != null &&
                              data.data.repayBillList.length > 0
                            ) {
                              that.repayBillList.items =
                                data.data.repayBillList;
                            } else {
                              that.repayBillList.items = "";
                            }
                          }
                        }
                      });
                    },
                    statusChoice: function(statusVal) {
                      this.currentPageRepay = 1;
                      $("#loadMoreButton1").html(
                        '<i class="iconfont">&#xe65d;</i> <span>上拉刷新数据</span>'
                      );
                      this.statusCash = statusVal;
                      this.selectProfitInit();
                    },
                    sortChoice: function(sortVal) {
                      this.currentPageRepay = 1;
                      $("#loadMoreButton1").html(
                        '<i class="iconfont">&#xe65d;</i> <span>上拉刷新数据</span>'
                      );
                      if (sortVal == 0) {
                        this.timeType = 0;
                        $("#paymentTime").removeClass("sortSelected");
                      } else if (sortVal == 1 && this.up) {
                        this.timeType = 1;
                        this.up = false;
                        $("#paymentTime").addClass("sortSelected");
                      } else if (sortVal == 1 && !this.up) {
                        this.timeType = 2;
                        this.up = true;
                        $("#paymentTime").addClass("sortSelected");
                      }
                      this.selectProfitInit();
                    },
                    //回报内容
                    showInfo: function(id) {
                      // console.log(id);
                      $.ajax({
                        url: "/userCenter/investBill/getDescr",
                        type: "post",
                        data: { id: id, requestSource: "WAP", token: token },
                        dataType: "json",
                        success: function(data) {
                          // console.log(data);
                          jumi.alert({
                            title: "回报内容",
                            content: data.data,
                            button: [
                              {
                                value: "知道了"
                              }
                            ]
                          });
                        }
                      });
                    },
                    //分享红包(弹出来红包列表框)
                    shareRedpacket: function(actionId) {
                      var that = this;
                      $("#hbMask").removeClass("hidden");
                      $("#cashDialog").removeClass("hidden");
                      var paraGet = {
                        gearId: actionId,
                        requestSource: "WAP",
                        token: token
                      };
                      $.ajax({
                        url: "/hongbao/cashHongbao/getGearShareRecordList",
                        type: "post",
                        data: paraGet,
                        dataType: "json",
                        success: function(data) {
                          // console.log(data);
                          that.getHbList = data.data;
                        }
                      });
                    },
                    closeDialog: function() {
                      $("#hbMask").addClass("hidden");
                      $("#cashDialog").addClass("hidden");
                    },
                    getShare: function(investLogid) {
                      var that = this;
                      var params = {
                        investBillId: investLogid,
                        requestSource: "WAP",
                        token: token
                      };
                      $.ajax({
                        url: "/hongbao/cashHongbao/shareUserReceiveHongbao",
                        type: "post",
                        data: params,
                        dataType: "json",
                        success: function(data) {
                          // console.log(data);
                          that.shareIntroducer = data.data.shareIntroducer;
                          that.shareItemname = data.data.itemName;
                          $("#cashDialog").addClass("hidden");
                          that.isShow = true;
                          ////分享
                          weixin
                            .setTitle(data.data.shareTitle)
                            .setDesc(data.data.shareContent)
                            .setImg(data.data.shareImageUrl)
                            .setUrl(data.data.shareLinkUrl)
                            .share();
                        }
                      });
                    },
                    closeDialoghb: function() {
                      $("#hbMask").addClass("hidden");
                      this.isShow = false;
                    },
                    goOrderpage: function(orderId) {
                      location.href =
                        "/h5/views/account/active/activeDetail.html?orderId=" +
                        orderId;
                    }
                  }
                }
              },
              ready: function() {
                var that = this;
                nav.setActiveNav("account");
                $("#myloading").remove();

                //上拉刷新-加载更多记录(收益)
                load.pullup({
                  el: "#tabs1",
                  button: "#loadMoreButton1",
                  callback: function(options) {
                    var component = that.$children[0];

                    component.currentPageRepay++;

                    var paraload = {
                      token: token,
                      pageSize: 10,
                      currentPage: component.currentPageRepay,
                      costType: 1, //1 收益；0 实物
                      statusCash: component.statusCash, //兑付状态(0:未兑付，1：已兑付 ,2:兑付中)
                      timeType: component.timeType, //排序类型(0:支持时间降序 1:兑付时间升序 2:兑付时间降序)
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/userCenter/investBill/getInvestBillList",
                      type: "post",
                      dataType: "json",
                      data: paraload,
                      success: function(data) {
                        //   console.log(data);
                        if (data.code == "0000") {
                          if (
                            data.data != null &&
                            data.data.repayBillList != null &&
                            data.data.repayBillList.length > 0
                          ) {
                            for (
                              var i = 0;
                              i < data.data.repayBillList.length;
                              i++
                            ) {
                              component.repayBillList.items.push(
                                data.data.repayBillList[i]
                              );
                            }
                            setTimeout(function() {
                              $(".async").asyncload();
                            }, 0);

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
                //end load

                //上拉刷新-加载更多记录(实物)
                load.pullup({
                  el: "#tabs2",
                  button: "#loadMoreButton2",
                  callback: function(options) {
                    var component = that.$children[0];

                    options.currentPage++;

                    var paraload = {
                      token: token,
                      costType: 0,
                      pageSize: 10,
                      currentPage: options.currentPage,
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/userCenter/investBill/getInvestBillList",
                      type: "post",
                      dataType: "json",
                      data: paraload,
                      success: function(data) {
                        //   console.log(data);
                        if (data.code == "0000") {
                          if (
                            data.data != null &&
                            data.data.noRepayBillList != null &&
                            data.data.noRepayBillList.length > 0
                          ) {
                            for (
                              var i = 0;
                              i < data.data.noRepayBillList.length;
                              i++
                            ) {
                              component.noRepayBillList.items.push(
                                data.data.noRepayBillList[i]
                              );
                            }
                            setTimeout(function() {
                              $(".async").asyncload();
                            }, 0);

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
                //end load
              }
            }); //vue end
          }
        }
      });
    }); //isLogin的结束
  } else {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, "/h5/views/account/invest/invest.html");
  }
});
