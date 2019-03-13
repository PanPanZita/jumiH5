define([
  "jumi",
  "vue",
  "isLogin",
  "isLoginwx",
  "getPara",
  "weixin",
  "DateFormat"
], function(jumi, vue, isLogin, isLoginwx, getPara, weixin, DateFormat) {
  var para = getPara.get();
  var token = localStorage.getItem("token");
  var parainit = {
    actionId: para.actionId,
    requestSource: "WAP",
    token: token
  };
  isLogin(function() {
    $.ajax({
      url: "/userCenter/investBill/getBillList",
      type: "post",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-detail": {
                template: "#investDetailTemplate",
                data: function() {
                  return {
                    data: data.data,
                    investOrder: data.data.jmInvestBillList //订单详情
                  };
                },
                methods: {
                  //回报内容
                  showInfo: function() {
                    var that = this;
                    jumi.alert({
                      title: "回报内容",
                      content: that.data.descr,
                      button: [
                        {
                          value: "知道了"
                        }
                      ]
                    });
                  },
                  goOrderDetail: function(orderId) {
                    location.href =
                      "/h5/views/account/active/activeDetail.html?orderId=" +
                      orderId;
                  }
                }, //methods结束
                filters: {
                  timeStr: function(timeStr) {
                    return new Date(timeStr).Format("yyyy-MM-dd hh:mm");
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
