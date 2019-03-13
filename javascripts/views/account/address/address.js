define(["jumi", "isLogin", "isLoginwx", "vue", "weixin"], function(
  jumi,
  isLogin,
  isLoginwx,
  vue,
  weixin
) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
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
              "my-address": {
                template: "#addressTemplate",
                data: function() {
                  return {
                    data: data.data,
                    addressList: data.data.addressList
                  };
                },
                methods: {
                  //设为默认[和编辑地址是同一个接口，传参不同]
                  setDefault: function(id, isUse) {
                    var that = this;
                    var paraset = {
                      addressId: id,
                      isUse: isUse,
                      requestSource: "WAP",
                      token: token
                    };
                    // console.log(paraset);
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
                          location.reload();
                        } else {
                          jumi.tips(data.msg);
                        }
                      }
                    });
                  },
                  //编辑
                  editAddress: function(id) {
                    location.href = "addressEdit.html?address_id=" + id;
                  },
                  //新增地址
                  createAddress: function() {
                    location.href = "addressCreate.html";
                  },
                  //删除地址
                  delAddress: function(id) {
                    var that = this;
                    var paradel = {
                      addressId: id,
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
                } //methods的结束
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
          }); //vue的结束语句
        } //data.code='0000'的函数
      } //success的成功函数
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
