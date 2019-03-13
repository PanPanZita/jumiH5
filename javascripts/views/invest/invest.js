define([
  "jumi",
  "asyncload",
  "weixin",
  "getPara",
  "vue",
  "isLogin",
  "isLoginwx",
  "prism",
  "scrolltotop",
  "DateFormat",
  "wxBackbtn"
], function(
  jumi,
  asyncload,
  weixin,
  getPara,
  vue,
  isLogin,
  isLoginwx,
  prism,
  scrolltotop,
  DateFormat,
  wxBackbtn
) {
  //   alert("1/5/9" + location.href);
  var para = getPara.get();
  // var startIndex = location.href.indexOf('.');  //首次.出现的位置
  // var url = location.href.substring(startIndex+1);  //jumizc.com/h5/views/invest/initiator.html?user_id=1000
  // var a = location.href.split(/\/|.html/);
  // var itemId = a[a.length-2];
  var preType = para.preType ? para.preType : 0; //页面类型0正常页面1预览页面
  var itemFlag = para.itemFlag ? para.itemFlag : "no"; //项目详情页面带上itemFlag这个标签
  localStorage.setItem("itemFlag", itemFlag);
  var token = localStorage.getItem("token");

  //   微信登陆--该链接后面带参数
  var url = location.href.split("&code=")[0];
  var locationCodepar = location.href.split("&code=")[1];

  var parainit = {
    preType: preType,
    itemId: para.itemId,
    token: token,
    requestSource: "WAP"
  };
  if (!locationCodepar) {
    isLogin(function() {
      $.ajax({
        url: "/item/getItemBasicInfo",
        type: "post",
        dataType: "json",
        timeout: 30000,
        data: parainit,
        success: function(data) {
          // console.log(data);
          if (data.code == "0000") {
            new vue({
              el: "body",
              components: {
                "my-banner": {
                  template: "#bannerTemplate",
                  data: function() {
                    return {
                      data: data.data,
                      itemFlag: data.data.itemFlag //项目的标签
                    };
                  }
                },
                "my-item": {
                  template: "#itemTemplate",
                  data: function() {
                    return {
                      data: data.data,
                      scaleStr: "" //为了展示一个小数点例如：100.00就写了该字段
                    };
                  },
                  ready: function() {
                    var percent = data.data.scale;
                    percent >= 100 ? (percent = 100) : (percent = percent);
                    $(".progress-bar").animate(
                      {
                        width: percent + "%"
                      },
                      1000
                    );

                    this.scaleStr = percent.toFixed(2);
                  }
                },
                "my-video": {
                  template: "#videoTemplate",
                  data: function() {
                    return {
                      data: data.data
                    };
                  },
                  ready: function() {
                    var that = this;
                    // console.log(that);
                    ///////关于视频
                    var videoUrl = that.data.sourceVideoPath;
                    if (videoUrl != "") {
                      (function InitPlayer(video) {
                        var player = new prismplayer({
                          id: "J_prismPlayer", // 容器id
                          source: video, // 视频url 支持互联网可直接访问的视频地址
                          autoplay: true, // 自动播放
                          width: "100%", // 播放器宽度
                          height: "250px", // 播放器高度
                          skinLayout: [
                            {
                              align: "blabs",
                              x: 0,
                              y: 0,
                              name: "controlBar",
                              children: [
                                {
                                  align: "tlabs",
                                  x: 0,
                                  y: 0,
                                  name: "progress"
                                },
                                {
                                  align: "tl",
                                  x: 15,
                                  y: 26,
                                  name: "playButton"
                                },
                                {
                                  align: "tl",
                                  x: 10,
                                  y: 24,
                                  name: "timeDisplay"
                                },
                                {
                                  align: "tr",
                                  x: 20,
                                  y: 25,
                                  name: "fullScreenButton"
                                },
                                {
                                  align: "tr",
                                  x: 20,
                                  y: 25,
                                  name: "volume"
                                }
                              ]
                            }
                          ]
                        });
                      })(videoUrl);
                    }
                  }
                },
                "my-detail": {
                  template: "#detailTemplate",
                  data: function() {
                    return {
                      data: data.data
                    };
                  },
                  methods: {
                    safeguard: function() {
                      jumi.alert({
                        title: "保障与风险",
                        content: data.data.h5Safeguard,
                        button: false
                      });
                    }
                  }
                },
                "my-trends": {
                  template: "#trendsTemplate",
                  data: function() {
                    return {
                      data: data.data,
                      itemtrends: []
                    };
                  },
                  methods: {
                    detailDynamics: function(index) {
                      var that = this;
                      var inforId = that.itemtrends[index].id;
                      location.href =
                        "/h5/views/notice/projectDynamics.html?inforId=" +
                        inforId;
                    }
                  },
                  filters: {
                    timeStr: function(timeStr) {
                      return new Date(timeStr).Format("yyyy-MM-dd hh:mm");
                    }
                  },
                  ready: function() {
                    var that = this;
                    var paradynamics = {
                      itemId: para.itemId,
                      requestSource: "WAP",
                      token: token
                    };
                    $.ajax({
                      url: "/item/getItemTrendsList",
                      type: "post",
                      dataType: "json",
                      data: paradynamics,
                      success: function(data) {
                        that.data = data.data;
                        // console.log(data);
                        // that.$root.$children[5].itemtrends = data.data.jmNoticeList;
                        that.itemtrends = data.data.jmNoticeList;
                      }
                    });
                  }
                },
                "my-support": {
                  template: "#supportTemplate",
                  data: function() {
                    return {
                      data: data.data,
                      lists: [],
                      currentPage: 1,
                      pageSize: 10,
                      isLoading: 0
                    };
                  },
                  ready: function() {
                    var that = this;
                    var paraInvestorlist = {
                      itemId: para.itemId,
                      requestSource: "WAP",
                      currentPage: 1,
                      pageSize: 999,
                      token: token
                    };
                    $.ajax({
                      url: "/item/getInvestorList",
                      type: "post",
                      dataType: "json",
                      data: paraInvestorlist,
                      success: function(data) {
                        // console.log(data);
                        that.data = data.data;
                        that.lists = data.data.investorList;
                      }
                    });
                  }
                },
                "my-foot": {
                  template: "#footTemplate",
                  data: function() {
                    return {
                      data: data.data
                    };
                  },
                  methods: {
                    addToWeixin: function() {
                      var codeStr = "";
                      var opration = "";
                      var weixinStr = "";

                      if (localStorage.fromapp == "ios") {
                        opration =
                          '<span class="clr-strike">微信扫描</span> 二维码，添加客服微信';
                      } else if (localStorage.fromapp == "android") {
                        opration =
                          '<span class="clr-strike">微信扫描</span> 二维码，添加客服微信';
                      } else {
                        opration =
                          '<span class="clr-strike">长按</span> 识别二维码，添加客服微信';
                      }

                      if (data.data.wxImagePath != "") {
                        codeStr =
                          "" +
                          "	<p>" +
                          opration +
                          "</p>" +
                          '	<p><img src="' +
                          data.data.wxImagePath +
                          '" alt="" style="width:auto;height:15rem;margin:0 auto;"></p>';
                      } else {
                        codeStr = "<p>暂无讨论群，请随时关注！</p>";
                      }
                      weixinStr =
                        '<div style="text-align:center;">' + codeStr + "</div>";

                      jumi.alert({
                        title: "客服二维码",
                        content: weixinStr,
                        button: false
                      });
                    }
                  },
                  filters: {
                    countFilter: function(count) {
                      var countz = new Number(count);
                      if (countz > 99) {
                        countz = "99+";
                      } else if (countz == 0) {
                        countz = "";
                      }
                      return countz;
                    }
                  }
                }
              },
              ready: function() {
                $(".async").asyncload();
                $("#myloading").remove();
                var that = this;

                localStorage.setItem("itemFlag", that.$children[0].itemFlag);
                var shareUrl =
                  location.origin +
                  "/h5/views/invest/invest.html?itemId=" +
                  para.itemId +
                  "&itemFlag=" +
                  that.$children[0].itemFlag;
                //分享功能必须要保证  url   为正常的链接（不能无值或者不能是undefined），否则手机端分享出去的链接不正常
                if (localStorage.fromapp == "ios") {
                  var o = {
                    title: that.$children[0].data.shareTitle,
                    desc: that.$children[0].data.shareContent,
                    img: that.$children[0].data.imagePath11,
                    url: shareUrl
                  };
                  window.webkit.messageHandlers.share.postMessage(o);
                } else if (localStorage.fromapp == "android") {
                  var o = {
                    title: that.$children[0].data.shareTitle,
                    desc: that.$children[0].data.shareContent,
                    img: that.$children[0].data.imagePath11,
                    url: shareUrl
                  };
                  window.Android.callAndroidAction("0", JSON.stringify(o));
                } else {
                  weixin
                    .setTitle(that.$children[0].data.shareTitle)
                    .setDesc(that.$children[0].data.shareContent)
                    .setImg(that.$children[0].data.imagePath11)
                    .setUrl(shareUrl)
                    .share(true);
                }

                // 选项卡切换
                $(".tab-handle li").click(function() {
                  var iIndex = $(this).index();
                  $(".tab-con")
                    .find(".tabCon")
                    .hide()
                    .eq(iIndex)
                    .show();
                  $(".tab-handle li")
                    .removeClass("active")
                    .eq(iIndex)
                    .addClass("active");
                });

                //选项卡定位
                $(window).scroll(function() {
                  var a = $(window).scrollTop();
                  var b = $("#tabFixed").offset().top;
                  var c = $("#tabBox").offset().top;

                  if (a >= b) {
                    $("#tabFixed").addClass("tabFixed");
                  }
                  if (a <= c) {
                    $("#tabFixed").removeClass("tabFixed");
                  }
                });
              }
            });
          } else {
            jumi.tips("暂无权限，即将回到首页");
            setTimeout(function() {
              location.href = location.origin + "/h5/views/main/index.html";
            }, 3000);
          }
        }
      });
    }); //isLogin的结束
  } else {
    var locationCode = locationCodepar.split("&state=")[0];
    isLoginwx(locationCode, url);
  }

  if (location.href.split("from=")[1]) {
    var fromPara = location.href.split("from=")[1];
    var isappinstalledPara = fromPara.split("&isappinstalled")[0];
    //如果是·分享出来的链接，点击返回按钮，那么就会跳转到首页
    if (isappinstalledPara) {
      wxBackbtn.setReturnUrl(); //控制微信浏览器的返回按钮
    }
  }
});
