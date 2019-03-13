define([
  "jumi",
  "vue",
  "asyncload",
  "nav",
  "getPara",
  "isLogin",
  "isLoginwx",
  "tab",
  "weixin"
], function(
  jumi,
  vue,
  asyncload,
  nav,
  getPara,
  isLogin,
  isLoginwx,
  tab,
  weixin
) {
  var outpara = getPara.get();
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    assmentId: outpara.id,
    requestSource: "WAP",
    //paymentStatus: 0,
    currentPage: 1,
    pageSize: 10
  };
  isLogin(function() {
    $.ajax({
      type: "get",
      url: "/userCenter/financialManager/getCommssionList",
      dataType: "json",
      data: parainit,
      success: function(data) {
        if (data.code == "0000") {
          if (data.data != null) {
            new vue({
              el: "body",
              components: {
                "my-invite": {
                  template: "#inviteTemplate",
                  data: function() {
                    return {
                      allCommList: {
                        items: data.data.allCommList,
                        currentPage: 1,
                        pageSize: 10,
                        isLoading: 0
                      },
                      noPayCommList: {
                        items: data.data.noPayCommList,
                        currentPage: 1,
                        pageSize: 10,
                        isLoading: 0
                      },
                      payCommList: {
                        items: data.data.payCommList,
                        currentPage: 1,
                        pageSize: 10,
                        isLoading: 0
                      }
                    };
                  },
                  methods: {
                    test: function() {
                      jumi.alert({
                        content: document.getElementById("upgrade-success"),
                        button: [
                          {
                            value: "知道了"
                          }
                        ]
                      });
                    },
                    unGet: function() {
                      $(".un-get").css({
                        display: "none"
                      });
                    },
                    loadMore: function(isloaded, type) {
                      if (isloaded != 0) {
                        return;
                      }
                      var that = this;
                      if (type == 0) {
                        that.allCommList.isLoading = 1;
                        that.allCommList.currentPage++;
                        var innerpara = {
                          currentPage: that.allCommList.currentPage,
                          pageSize: that.allCommList.pageSize,
                          token: token,
                          assmentId: outpara.id,
                          requestSource: "WAP",
                          paymentStatus: 0
                        };

                        $.ajax({
                          url: "/userCenter/financialManager/getCommssionList",
                          type: "get",
                          dataType: "json",
                          data: innerpara,
                          success: function(data) {
                            if (data.code == "0000") {
                              if (
                                data.data != null &&
                                data.data.allCommList.length > 0
                              ) {
                                for (key in data.data.allCommList) {
                                  that.allCommList.items.push(
                                    data.data.allCommList[key]
                                  );
                                }
                                that.allCommList.isLoading = 0;
                              } else {
                                that.allCommList.isLoading = 2;
                              }
                            } else {
                              jumi.tips(data.msg);
                            }
                          }
                        });
                      } else if (type == 1) {
                        that.noPayCommList.isLoading = 1;
                        that.noPayCommList.currentPage++;
                        var innerpara = {
                          token: token,
                          assmentId: outpara.id,
                          requestSource: "WAP",
                          paymentStatus: 1,
                          currentPage: that.noPayCommList.currentPage,
                          pageSize: that.noPayCommList.pageSize
                        };

                        $.ajax({
                          url: "/userCenter/financialManager/getCommssionList",
                          type: "get",
                          dataType: "json",
                          data: innerpara,
                          success: function(data) {
                            if (data.code == "0000") {
                              if (
                                data.data != null &&
                                data.data.noPayCommList.length > 0
                              ) {
                                for (key in data.data.noPayCommList) {
                                  that.noPayCommList.items.push(
                                    data.data.noPayCommList[key]
                                  );
                                }
                                that.noPayCommList.isLoading = 0;
                              } else {
                                that.noPayCommList.isLoading = 2;
                              }
                            } else {
                              jumi.tips(data.msg);
                            }
                          }
                        });
                      } else if (type == 2) {
                        that.payCommList.isLoading = 1;
                        that.payCommList.currentPage++;
                        var innerpara = {
                          token: token,
                          assmentId: outpara.id,
                          requestSource: "WAP",
                          paymentStatus: 2,
                          currentPage: that.payCommList.currentPage,
                          pageSize: that.payCommList.pageSize
                        };
                        $.ajax({
                          url: "/userCenter/financialManager/getCommssionList",
                          type: "get",
                          dataType: "json",
                          data: innerpara,
                          cache: false,
                          success: function(data) {
                            if (data.code == "0000") {
                              if (
                                data.data != null &&
                                data.data.payCommList.length > 0
                              ) {
                                for (key in data.data.payCommList) {
                                  that.payCommList.items.push(
                                    data.data.payCommList[key]
                                  );
                                }
                                that.payCommList.isLoading = 0;
                              } else {
                                that.payCommList.isLoading = 2;
                              }
                            } else {
                              jumi.tips(data.msg);
                            }
                          }
                        });
                      }
                    }
                  }
                }
              },
              ready: function() {
                nav.setActiveNav("account");
                //分享
                weixin
                  .setTitle()
                  .setDesc()
                  .setImg()
                  .setUrl()
                  .share();
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
