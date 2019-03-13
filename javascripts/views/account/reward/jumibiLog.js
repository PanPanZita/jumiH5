define([
  "jumi",
  "nav",
  "vue",
  "isLogin",
  "isLoginwx",
  "tab",
  "weixin",
  "load",
  "scrolltotop",
  "getPara",
  "Ddate"
], function(
  jumi,
  nav,
  vue,
  isLogin,
  isLoginwx,
  tab,
  weixin,
  load,
  scrolltotop,
  getPara,
  Ddate
) {
  var token = localStorage.getItem("token");
  var mydate = getPara.get();

  var parainit = {
    year: mydate.year,
    month: mydate.month,
    currentPage: 1,
    pageSize: 20,
    subjectCode: "100201", //代表我要查询的是红包
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/billAccount/getBillAccountList",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-jumibilog": {
                template: "#jumibiLogTemplate",
                data: function() {
                  return {
                    selectedYear: "", //选中的年份
                    selectedMonth: "", //选中的月份
                    allList: {
                      items: data.data.billAccountResAll,
                      currentPage: 1,
                      pageSize: 20,
                      isLoading: 0
                    },
                    inList: {
                      items: data.data.billAccountResInto,
                      currentPage: 1,
                      pageSize: 20,
                      isLoading: 0
                    },
                    outList: {
                      items: data.data.billAccountResOut,
                      currentPage: 1,
                      pageSize: 20,
                      isLoading: 0
                    },
                    isIOSShow: localStorage.fromapp == "ios" //为IOS通过官方审核而用
                  };
                },
                methods: {
                  toSearch: function() {
                    var that = this;
                    // console.log(that);
                    var parasearch = {
                      year: that.selectedYear,
                      month: that.selectedMonth,
                      currentPage: 1,
                      pageSize: 20,
                      subjectCode: "100201", //代表我要查询的是红包
                      token: token,
                      requestSource: "WAP"
                    };
                    $.ajax({
                      url: "/userCenter/billAccount/getBillAccountList",
                      type: "post",
                      dataType: "json",
                      data: parasearch,
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          that.allList.items = data.data.billAccountResAll;
                          that.inList.items = data.data.billAccountResInto;
                          that.outList.items = data.data.billAccountResOut;

                          //初始化页码
                          that.allList.currentPage = 1;
                          that.inList.currentPage = 1;
                          that.outList.currentPage = 1;

                          //初始化加载更多按钮
                          that.allList.isLoading = 0;
                          that.inList.isLoading = 0;
                          that.outList.isLoading = 0;
                        }
                      }
                    });
                  },
                  showDetail: function(id) {
                    $.ajax({
                      url: "/userCenter/billAccount/getJmAcctSeqById",
                      type: "post",
                      dataType: "json",
                      data: { id: id, requestSource: "WAP", token: token },
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          var addtimeshow = data.data.createTime;
                          var coin_account =
                            data.data.flag == 0
                              ? "-" + data.data.amt
                              : "+" + data.data.amt;
                          var remark = !data.data.remark
                            ? "无"
                            : data.data.remark;
                          jumi.alert({
                            title: "记录详情",
                            content:
                              "<div>" +
                              "   <p>记录时间:" +
                              addtimeshow +
                              "</p>" +
                              "   <p>交易聚米币:" +
                              coin_account +
                              "</p>" +
                              "   <p>摘要:" +
                              remark +
                              "</p>" +
                              "</div>",
                            button: false
                          });
                        }
                      }
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

              //日期搜索
              if (mydate.year != "" && mydate.month != "") {
                $("#date").text(mydate.year + "年" + mydate.month + "月");
              } else {
                $("#date").text("请选择日期并搜索");
              }

              Ddate.init({
                trigger: "#date",
                callback: function(params) {
                  location.href =
                    "/h5/views/account/reward/jumibiLog.html?year=" +
                    params.year +
                    "&month=" +
                    params.month;
                }
              });

              //上拉刷新-加载更多记录（全部）
              load.pullup({
                el: "#tabs1",
                button: "#loadMoreButton1",
                callback: function(options) {
                  var component = that.$children[0];

                  options.currentPage++;

                  var paraload = {
                    year: mydate.year,
                    month: mydate.month,
                    subjectCode: "100201",
                    token: token,
                    flag: 2,
                    pageSize: 20,
                    currentPage: options.currentPage,
                    requestSource: "WAP"
                  };
                  console.log(paraload);
                  $.ajax({
                    url: "/userCenter/billAccount/getBillAccountList",
                    type: "post",
                    dataType: "json",
                    data: paraload,
                    success: function(data) {
                      console.log(data);
                      if (data.code == "0000") {
                        if (
                          data.data != null &&
                          data.data.billAccountResAll != null &&
                          data.data.billAccountResAll.length > 0
                        ) {
                          for (
                            var i = 0;
                            i < data.data.billAccountResAll.length;
                            i++
                          ) {
                            component.allList.items.push(
                              data.data.billAccountResAll[i]
                            );
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

              //上拉刷新-加载更多记录（收入）
              load.pullup({
                el: "#tabs2",
                button: "#loadMoreButton2",
                callback: function(options) {
                  var component = that.$children[0];

                  options.currentPage++;

                  var paraload = {
                    year: mydate.year,
                    month: mydate.month,
                    subjectCode: "100201",
                    token: token,
                    flag: 1,
                    pageSize: 20,
                    currentPage: options.currentPage,
                    requestSource: "WAP"
                  };
                  $.ajax({
                    url: "/userCenter/billAccount/getBillAccountList",
                    type: "post",
                    dataType: "json",
                    data: paraload,
                    success: function(data) {
                      if (data.code == "0000") {
                        if (
                          data.data != null &&
                          data.data.billAccountResInto != null &&
                          data.data.billAccountResInto.length > 0
                        ) {
                          for (
                            var i = 0;
                            i < data.data.billAccountResInto.length;
                            i++
                          ) {
                            component.inList.items.push(
                              data.data.billAccountResInto[i]
                            );
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

              //上拉刷新-加载更多记录（支出）
              load.pullup({
                el: "#tabs3",
                button: "#loadMoreButton3",
                callback: function(options) {
                  var component = that.$children[0];

                  options.currentPage++;

                  var paraload = {
                    year: mydate.year,
                    month: mydate.month,
                    subjectCode: "100201",
                    token: token,
                    flag: 0,
                    pageSize: 20,
                    currentPage: options.currentPage,
                    requestSource: "WAP"
                  };
                  $.ajax({
                    url: "/userCenter/billAccount/getBillAccountList",
                    type: "post",
                    dataType: "json",
                    data: paraload,
                    success: function(data) {
                      if (data.code == "0000") {
                        if (
                          data.data != null &&
                          data.data.billAccountResOut != null &&
                          data.data.billAccountResOut.length > 0
                        ) {
                          for (
                            var i = 0;
                            i < data.data.billAccountResOut.length;
                            i++
                          ) {
                            component.outList.items.push(
                              data.data.billAccountResOut[i]
                            );
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
