define([
  "jquery",
  "jumi",
  "isLogin",
  "isLoginwx",
  "vue",
  "weixin",
  "getPara",
  "screenControl",
  "wxBackbtn"
], function(
  $,
  jumi,
  isLogin,
  isLoginwx,
  vue,
  weixin,
  getPara,
  screenControl,
  wxBackbtn
) {
  wxBackbtn.setReturnUrl(); //控制微信浏览器的返回按钮
  var para = getPara.get();
  var token = localStorage.getItem("token"); //判断是否是新用户

  if (para.from) {
    // 是分享出来的链接,
    var locationCodepar = location.href.split("&code=")[1];
  } else {
    var locationCodepar = location.href.split("?code=")[1];
  }
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  if (!locationCodepar) {
    isLogin(function() {
      $.ajax({
        url: "/moonFetivalActivity/getHomePage",
        type: "get",
        dataType: "json",
        data: parainit,
        success: function(data) {
          //   console.log(data);
          if (data.code === "0000") {
            new vue({
              el: "body",
              components: {
                "my-midautumn": {
                  template: "#midautumnTemplate",
                  data: function() {
                    return {
                      userName: "",
                      userPhone: "",
                      userAddress: "",
                      userAddressId: 0,
                      addressList: [], //请求的另外一个接口，表示地址列表
                      actStatus: data.data.actStatus, //表示活动是否已经结束0未结束1已结束
                      count: data.data.count, //已领取数量
                      taskOneend: data.data.scheduleData.zhongFlag, //任务一是否完成0未完成1完成点亮
                      taskTwoend: data.data.scheduleData.qiuFlag,
                      taskThereend: data.data.scheduleData.jiaFlag,
                      taskFourend: data.data.scheduleData.jieFlag,
                      receiveStatus: data.data.scheduleData.receiveStatus, //0未完成所有任务1已完成所有任务且未领取2已完成所有任务已领取3已完成所有任务且剩余0份
                      addressDialog: false, //地址弹框是否关闭，默认关闭
                      stage: "1", //表示进行到了哪一个阶段..1代表中2代表秋3代表佳4代表节
                      zhongStatus: "1", //中字的状态，1灰显2正在点击3已经完成
                      qiuStatus: "1", //秋字的状态，1灰显2正在点击3已经完成
                      jiaStatus: "1", //佳字的状态，1灰显2正在点击3已经完成
                      jieStatus: "1", //节字的状态，1灰显2正在点击3已经完成

                      isShare: false //是否分享到朋友圈
                    };
                  },
                  methods: {
                    prizes: function() {
                      jumi.alert({
                        title: "",
                        content: document.getElementById("prizePar"),
                        button: [
                          {
                            value: "知道了"
                          }
                        ]
                      });
                    },
                    ruleDesc: function() {
                      jumi.alert({
                        title: "",
                        content:
                          "<p style='margin-bottom:4vw;'>1、集齐“中”“秋”“佳”“节”四个字，即可领取精美月饼礼盒，限量200份。</p><p  style='margin-bottom:4vw;'>2、活动结束后，所有参与活动但未领到月饼的用户可获得28元红包奖励。</p><p style='margin-bottom:4vw;'>3、新手训练营及不回报本金型投资不参与本次活动。</p><p style='margin-bottom:4vw;'>4、活动奖励会在领取后3个工作日内发放，如发放日与周末或节假日冲突，则延迟至工作日发放。</p><p style='margin-bottom:4vw;'>5、在法律允许范围内，本活动最终解释权归属聚米众筹所有。</p><p style='margin-bottom:4vw;'>6、活动时间：9月11日-9月30日。</p><p>在此，聚米运营团队感谢您长久以来的陪伴和支持。</p>",
                        button: [
                          {
                            value: "知道了"
                          }
                        ]
                      });
                    },
                    goLightupOne: function() {
                      location.href = "/h5/views/wheel/wheel.html";
                    },
                    goLightupTwo: function() {
                      location.href =
                        "/h5/views/main/list.html?type=0&status=0&itemName=";
                    },
                    goLightupThere: function() {
                      //   this.isShare = true;
                      var paraMidautumn = {
                        token: token,
                        requestSource: "WAP"
                      };
                      $.ajax({
                        url: "/moonFetivalActivity/shareLightWord",
                        type: "post",
                        dataType: "json",
                        data: paraMidautumn,
                        success: function(data) {
                          //   alert("分享成功");
                          if (data.code == "0000") {
                            location.reload();
                          }
                        },
                        error: function() {}
                      });
                    },
                    // hideSharemask: function() {
                    //   this.isShare = false;
                    // },
                    goLightupFour: function() {
                      location.href =
                        "/h5/views/main/list.html?type=0&status=0&itemName=";
                    },
                    clickZhong: function() {
                      var that = this;
                      // 任务完成0，1，2，3，4个的各种情况
                      that.stage = "1";
                      if (that.taskOneend == "0") {
                        that.zhongStatus = "2";
                        that.qiuStatus = "1";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "0"
                      ) {
                        that.zhongStatus = "3";
                        that.qiuStatus = "1";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "0"
                      ) {
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "0"
                      ) {
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "1"
                      ) {
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "3";
                      }
                    },
                    clickQiu: function() {
                      var that = this;
                      if (that.taskOneend == "0") {
                        that.stage = "1";
                        jumi.tips("请先点亮上一个文字~");
                        that.zhongStatus = "2";
                        that.qiuStatus = "1";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "0"
                      ) {
                        that.stage = "2";
                        that.zhongStatus = "3";
                        that.qiuStatus = "2";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "0"
                      ) {
                        that.stage = "2";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "0"
                      ) {
                        that.stage = "2";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "1"
                      ) {
                        that.stage = "2";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "3";
                      }
                    },
                    clickJia: function() {
                      var that = this;
                      if (that.taskOneend == "0") {
                        that.stage = "1";
                        jumi.tips("请先点亮上一个文字~");
                        that.zhongStatus = "2";
                        that.qiuStatus = "1";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "0"
                      ) {
                        that.stage = "2";
                        jumi.tips("请先点亮上一个文字~");
                        that.zhongStatus = "3";
                        that.qiuStatus = "2";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "0"
                      ) {
                        that.stage = "3";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "2";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "0"
                      ) {
                        that.stage = "3";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "1"
                      ) {
                        that.stage = "3";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "3";
                      }
                    },
                    clickJie: function() {
                      var that = this;
                      if (that.taskOneend == "0") {
                        that.stage = "1";
                        jumi.tips("请先点亮上一个文字~");
                        that.zhongStatus = "2";
                        that.qiuStatus = "1";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "0"
                      ) {
                        that.stage = "2";
                        jumi.tips("请先点亮上一个文字~");
                        that.zhongStatus = "3";
                        that.qiuStatus = "2";
                        that.jiaStatus = "1";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "0"
                      ) {
                        that.stage = "3";
                        jumi.tips("请先点亮上一个文字~");
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "2";
                        that.jieStatus = "1";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "0"
                      ) {
                        that.stage = "4";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "2";
                      } else if (
                        that.taskOneend == "1" &&
                        that.taskTwoend == "1" &&
                        that.taskThereend == "1" &&
                        that.taskFourend == "1"
                      ) {
                        that.stage = "4";
                        that.zhongStatus = "3";
                        that.qiuStatus = "3";
                        that.jiaStatus = "3";
                        that.jieStatus = "3";
                      }
                    },
                    getReward: function() {
                      var that = this;
                      if (that.receiveStatus == "0") {
                        jumi.alert({
                          title: "",
                          content: "点亮所有文字即可领取奖励",
                          button: [
                            {
                              value: "知道了"
                            }
                          ]
                        });
                      } else if (that.receiveStatus == "1") {
                        that.addressDialog = true;
                        $.ajax({
                          url: "/moonFetivalActivity/getAddressList",
                          type: "get",
                          dataType: "json",
                          data: parainit,
                          success: function(data) {
                            // console.log(data);
                            if (data.code === "0000") {
                              that.addressList = data.data;
                            } else {
                              jumi.tips(data.msg);
                            }
                          }
                        });
                      } else if (that.receiveStatus == "2") {
                        jumi.alert({
                          title: "",
                          content: "奖励已领取",
                          button: [
                            {
                              value: "知道了"
                            }
                          ]
                        });
                      } else if (that.receiveStatus == "3") {
                        jumi.alert({
                          title: "",
                          content: "奖品已兑完",
                          button: [
                            {
                              value: "知道了"
                            }
                          ]
                        });
                      }
                    },
                    checkedSign: function(checkedAddress, e) {
                      var that = this;
                      var isChecked = $(e.target).prop("checked"); //判断该选项是否被选中了,初始化的是否都是true。因为要去点击，所以为true
                      if (isChecked) {
                        //首先去掉之前的点击状态
                        $(".checkedSign").prop("checked", false);
                        $(".checkedSign").removeClass("bg-checked");
                        $(".address").removeClass("li-checked");
                        //其次，给此时此刻正在点击的值加上点击状态
                        $(e.target).prop("checked", true);
                        $(".newAddress").prop("disabled", true);
                        $(e.target).addClass("bg-checked");
                        $(".address" + checkedAddress.addressId).addClass(
                          "li-checked"
                        );
                        //最后开始赋值
                        that.userName = checkedAddress.userName;
                        that.userPhone = checkedAddress.userPhone;
                        that.userAddress = checkedAddress.address;
                        that.userAddressId = checkedAddress.addressId;
                      } else {
                        $(e.target).prop("checked", false);
                        $(".newAddress").prop("disabled", false);
                        $(e.target).removeClass("bg-checked");
                        $(".address" + checkedAddress.addressId).removeClass(
                          "li-checked"
                        );
                        that.userName = "";
                        that.userPhone = "";
                        that.userAddress = "";
                        that.userAddressId = 0;
                      }
                    },
                    cancelAddress: function() {
                      var that = this;
                      that.addressDialog = false;
                      that.userName = "";
                      that.userPhone = "";
                      that.userAddress = "";
                      that.userAddressId = 0;
                    },
                    sureAddress: function() {
                      var that = this;
                      var rePhone = /^1\d{10}$/;
                      var reNull = /^[\s]*$/; //包括空格、换行、tab缩进等所有的空白
                      if (reNull.test(that.userName)) {
                        jumi.tips("收货人不能为空~");
                        return false;
                      }
                      if (reNull.test(that.userPhone)) {
                        jumi.tips("联系电话不能为空~");
                        return false;
                      }
                      if (reNull.test(that.userAddress)) {
                        jumi.tips("收货地址不能为空~");
                        return false;
                      }
                      if (!rePhone.test(that.userPhone)) {
                        jumi.tips("请输入正确的11位手机号~");
                        return false;
                      }
                      var params = {
                        address: that.userAddress,
                        addressId: that.userAddressId,
                        receiverName: that.userName,
                        receiverPhone: that.userPhone,
                        requestSource: "WAP",
                        token: token
                      };
                      $.ajax({
                        url: "/moonFetivalActivity/receiveReward",
                        type: "post",
                        dataType: "json",
                        data: params,
                        success: function(data) {
                          //   console.log(data);
                          that.addressDialog = false;
                          that.userName = "";
                          that.userPhone = "";
                          that.userAddress = "";
                          that.userAddressId = 0;
                          if (data.code === "0000") {
                            jumi.alert({
                              title: "",
                              content: "领取成功，奖励将会在3个工作日内发放",
                              button: [
                                {
                                  value: "知道了",
                                  callback: function() {
                                    location.reload();
                                  }
                                }
                              ]
                            });
                          } else {
                            jumi.tips(data.msg);
                          }
                        }
                      });
                    },
                    inputFocus: function() {
                      $("body").height(document.body.scrollHeight);
                    }
                  }
                }
              },
              ready: function() {
                $("#myloading").remove();
                var that = this;

                //   初始化进入到页面的展示结果

                if (that.$children[0].taskOneend) {
                  //任务一完成
                  that.$children[0].zhongStatus = "3";
                } else {
                  that.$children[0].zhongStatus = "2";
                }

                if (that.$children[0].taskTwoend) {
                  //任务二完成
                  that.$children[0].qiuStatus = "3";
                }

                if (that.$children[0].taskThereend) {
                  //任务三完成
                  that.$children[0].jiaStatus = "3";
                }

                if (that.$children[0].taskFourend) {
                  //任务四完成
                  that.$children[0].jieStatus = "3";
                }

                //分享
                var o = {
                  title: "月满中秋好“食”光",
                  desc: "家人，美食，团圆的饭桌上一样都不能少",
                  img:
                    "https://jumifinancetest.oss-cn-hangzhou.aliyuncs.com/itemDetail/1535680850081045613.png",
                  url: location.origin + "/h5/views/activity/midAutumn.html"
                };

                weixin
                  .setTitle(o.title)
                  .setDesc(o.desc)
                  .setImg(o.img)
                  .setUrl(o.url)
                  .share("midAutumnActivity");
              }
            }); //end vue
          }
        }
      });
    }); // isLogin的结束
  } else {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, "/h5/views/activity/midAutumn.html");
  }
});
