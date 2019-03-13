define(["jumi", "vue", "isLogin", "isLoginwx", "getPara", "weixin"], function(
  jumi,
  vue,
  isLogin,
  isLoginwx,
  getPara,
  weixin
) {
  var para = getPara.get();
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  isLogin(function() {
    $.ajax({
      type: "post",
      url: "/userCenter/setting/getUserAddress",
      dataType: "json",
      data: parainit,
      success: function(data) {
        // console.log(data);
        if (data.code == "0000") {
          new vue({
            el: "body",
            components: {
              "my-selectaddress": {
                template: "#selectAddressTemplate",
                data: function() {
                  return {
                    data: data.data,
                    addressList: data.data.addressList
                  };
                },
                methods: {
                  //设为默认
                  setDefault: function(address_id, isUse) {
                    var that = this;
                    var paraset = {
                      addressId: address_id,
                      isUse: isUse,
                      requestSource: "WAP",
                      token: token
                    };
                    $.ajax({
                      type: "post",
                      url: "/userCenter/setting/updateIsUse",
                      data: paraset,
                      dataType: "json",
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          that.data = data;
                          jumi.tips("修改成功！");
                        } else {
                          jumi.tips(data.msg);
                        }
                      }
                    });
                  },
                  //编辑
                  editAddress: function(address_id) {
                    location.href =
                      "cartAddressEdit.html?orderId=" +
                      para.orderId +
                      "&address_id=" +
                      address_id;
                  },
                  //选择
                  toSelect: function(address_id) {
                    location.href =
                      "activeDetail.html?orderId=" +
                      para.orderId +
                      "&address_id=" +
                      address_id;
                  },
                  //新增地址
                  createAddress: function() {
                    location.href =
                      "cartAddressCreate.html?orderId=" + para.orderId;
                  },
                  //删除地址
                  delAddress: function(address_id) {
                    var that = this;
                    var paradel = {
                      addressId: address_id,
                      requestSource: "WAP",
                      token: token
                    };
                    jumi.alert({
                      skin: "ui-dialog-bankcard",
                      content: "确认删除？",
                      button: [
                        {
                          value: "确认",
                          callback: function() {
                            $.ajax({
                              type: "post",
                              url: "/userCenter/setting/deleteAddress",
                              data: paradel,
                              dataType: "json",
                              success: function(data) {
                                // console.log(data);
                                if (data.code == "0000") {
                                  that.data = data;
                                  jumi.tips("删除成功！");
                                  location.reload();
                                } else {
                                  jumi.tips(data.msg);
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
              $("#myloading").remove();
              weixin
                .setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();
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
