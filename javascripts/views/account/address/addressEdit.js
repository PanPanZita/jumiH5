define([
  "jumi",
  "regexp",
  "getPara",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin"
], function(jumi, regexp, getPara, isLogin, isLoginwx, vue, weixin) {
  var token = localStorage.getItem("token"); //为了验证用户是否登录
  // console.log(token);
  var para = getPara.get();
  var parainit = {
    addressId: para.address_id,
    token: token,
    requestSource: "WAP"
  };
  // console.log(parainit);
  isLogin(function() {
    $.ajax({
      type: "post",
      url: "/userCenter/setting/getAddressById",
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
                    username: data.data.userName,
                    mobile: data.data.mobile,
                    province: data.data.province,
                    city: data.data.city,
                    address: data.data.address,
                    isUse: data.data.isUse, //是否设为默认地址
                    id: data.data.id,
                    optionProvinces: [],
                    optionCitys: [],
                    isSelectAbled: true, //city下拉选择框是否可用
                    isabled: false //保存按钮是否可用
                  };
                },
                init: function() {
                  var that = this;
                  // console.log(that);
                  $.ajax({
                    url: "/h5/javascripts/selectlinkage/area.js",
                    method: "post",
                    dataType: "json",
                    success: function(data) {
                      that.optionProvinces = data.province;
                      for (key in that.optionProvinces) {
                        if (that.province == that.optionProvinces[key].name) {
                          for (m in that.optionProvinces[key].cities.city) {
                            that.optionCitys =
                              that.optionProvinces[key].cities.city;
                            if (
                              that.city ==
                              that.optionProvinces[key].cities.city[m]
                            ) {
                              that.city =
                                that.optionProvinces[key].cities.city[m];
                            }
                          }
                        }
                      }
                    }
                  });
                },
                methods: {
                  changeProvince: function() {
                    for (key in this.optionProvinces) {
                      if (this.province == this.optionProvinces[key].name) {
                        for (m in this.optionProvinces[key].cities.city) {
                          this.optionCitys = this.optionProvinces[
                            key
                          ].cities.city;
                          this.city = this.optionProvinces[key].cities.city[0];
                          this.isSelectAbled = false;
                        }
                      }
                    }

                    this.isAbled();
                  },
                  changeCity: function() {
                    this.isAbled();
                  },
                  toInput: function() {
                    this.isAbled();
                  },
                  isAbled: function() {
                    var bool1 = !regexp.validate("null", this.username);
                    var bool2 = !regexp.validate("null", this.mobile);
                    var bool3 = !regexp.validate("null", this.province);
                    var bool4 = !regexp.validate("null", this.city);
                    var bool5 = !regexp.validate("null", this.address);
                    if (bool1 && bool2 && bool3 && bool4 && bool5) {
                      this.isabled = false;
                    } else {
                      this.isabled = true;
                    }
                  },
                  ok: function() {
                    var bool1 = !regexp.validate(
                      "length",
                      "2,8",
                      this.username
                    );
                    var bool2 = !regexp.validate("length", "11", this.mobile);
                    var bool3 = !regexp.validate("mobile", this.mobile);
                    var bool4 = !regexp.validate(
                      "length",
                      "2,50",
                      this.address
                    );

                    if (bool1) {
                      jumi.tips("收件人2-8个字符");
                      return;
                    }
                    if (bool2) {
                      jumi.tips("手机号码长度为11位");
                      return;
                    }
                    if (bool3) {
                      jumi.tips("请输入正确的手机号码");
                      return;
                    }
                    if (bool4) {
                      jumi.tips("地址2-50个字符");
                      return;
                    }

                    var parasave = {
                      userName: this.username,
                      mobile: this.mobile,
                      province: this.province,
                      city: this.city,
                      address: this.address,
                      addressId: this.id,
                      token: token,
                      requestSource: "WAP"
                    };
                    // console.log(parasave);
                    $.ajax({
                      type: "post",
                      url: "/userCenter/setting/updateAddress",
                      dataType: "json",
                      data: parasave,
                      success: function(data) {
                        // console.log(data);
                        if (data.code == "0000") {
                          location.href = "address.html";
                        }
                      }
                    });
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
