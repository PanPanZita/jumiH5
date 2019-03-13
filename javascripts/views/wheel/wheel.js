define([
  "jumi",
  "nav",
  "asyncload",
  "weixin",
  "isLogin",
  "isLoginwx",
  "getPara",
  "vue"
], function(jumi, nav, asyncload, weixin, isLogin, isLoginwx, getPara, vue) {
  var token = localStorage.getItem("token");
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  var paraclick = {
    activityId: 1,
    token: token,
    requestSource: "WAP"
  };

  var para = getPara.get();
  if (para.from) {
    // 是分享出来的链接,
    var locationCodepar = location.href.split("&code=")[1];
  } else {
    var locationCodepar = location.href.split("?code=")[1];
  }
  $.ajax({
    url: "/activity/getTurnTableIndex",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      if (data.code == "0000") {
        new vue({
          el: "body",
          components: {
            "my-wheel": {
              template: "#wheelTemplate",
              data: function() {
                return {
                  data: data.data,
                  awardList: data.data.jmAwardList, //奖品列表
                  freetimes: data.data.freeTimes, //剩余免费次数
                  neverClickbtn: true, //初始化页面表示还未点击中间按钮（控制不应该默认展示选项）
                  isRun: false, //是否正在运行，如果点击了就灰显按钮，防止刷单
                  current: 0, //转盘到达的当前位置
                  setRotating: null,
                  speed: 200, //速度
                  diffAdd: 30, //速度增加的值
                  diffSub: 10, //速度增加的值
                  award: {}, //抽中的奖品
                  time: 0 //记录开始抽奖时的时间
                };
              },
              methods: {
                toLogin: function() {
                  if (!locationCodepar) {
                    isLogin();
                  }
                },
                viewshistory: function() {
                  if (!locationCodepar) {
                    isLogin(function() {
                      location.href = "/h5/views/wheel/wheelRecord.html";
                    });
                  }
                },
                start: function() {
                  var that = this;
                  if (that.isRun) {
                    return;
                  } else {
                    //判断是否登录
                    isLogin(function() {
                      // 开始抽奖
                      that.rollResult();
                      that.time = Date.now();
                      that.speed = 200;
                      that.diffAdd = 30;
                      that.diffSub = 10;
                      that.isRun = true;
                      that.neverClickbtn = false;
                      $(".wheel-start")
                        .find("img")
                        .attr("src", "/h5/images/wheel/origin/wheel-end.png"); //灰显按钮
                    });
                  }
                },
                rollResult: function() {
                  var that = this;
                  //   请求接口得到该用户的转盘结果;
                  $.ajax({
                    type: "post",
                    url: "/needLogin/activity/checkDraw",
                    dataType: "json",
                    data: paraclick,
                    success: function(data) {
                      //判断各种类型的错误，并给出提示
                      if (data.code == "0000") {
                        //确认奖物品
                        that.freetimes = data.data.freetimes;
                        that.award.sort = data.data.sort;
                        that.award.awardName = data.data.awardName;
                        that.roll();
                      } else {
                        jumi.tips(data.msg);
                        return;
                      }
                    }
                  });
                },
                roll: function() {
                  var that = this;
                  var iIndex = that.award.sort - 1;
                  that.setRotating = setTimeout(function() {
                    that.current++;
                    if (that.current > 7) {
                      that.current = 0;
                    }
                    // 若抽中的奖品sort存在，并且已经转动了2秒了，则开始减速转动
                    if (
                      that.award.sort &&
                      (Date.now() - that.time) / 1000 > 2
                    ) {
                      that.speed += that.diffAdd; //（数值越来越大）则是"转动减速"
                      // 若转动时间超过4秒，并且奖品sort等于小格子的奖品sort，则停下来
                      if (
                        (Date.now() - that.time) / 1000 > 4 &&
                        that.award.sort == that.awardList[that.current].sort
                      ) {
                        clearTimeout(that.setRotating);
                        setTimeout(function() {
                          $(".award" + iIndex).animate({ padding: "2vw" });
                          jumi.alert({
                            content:
                              "恭喜！ 您成功抽取了" + that.award.awardName,
                            button: [
                              {
                                value: "知道了",
                                callback: function() {
                                  that.isRun = false;
                                  $(".wheel-start")
                                    .find("img")
                                    .attr(
                                      "src",
                                      "/h5/images/wheel/origin/wheel-start.png"
                                    ); //高亮按钮
                                }
                              }
                            ]
                          });
                        }, 0);

                        //解决bug：不是点击知道了，而是点击了弹框之外的地方，由于弹框的机制，点击了弹框之外的地方，弹框也会消失。那么出现的Bug就是按钮灰显不可点击
                        setTimeout(function() {
                          that.isRun = false;
                          $(".award" + iIndex).animate({ padding: "1vw" });
                          $(".wheel-start")
                            .find("img")
                            .attr(
                              "src",
                              "/h5/images/wheel/origin/wheel-start.png"
                            ); //高亮按钮
                        }, 200);

                        return;
                      }
                    } else {
                      // 若抽中的奖品不存在或者还没有转动2秒，则一直转动不止
                      that.speed -= that.diffSub; //转动加速
                    }
                    that.roll(); //保持不竭动力，因为整个函数运行是setTimeout();
                  }, that.speed);
                }
              }
            }
          },
          ready: function() {
            // 自动登陆
            if (locationCodepar) {
              var locationCode = locationCodepar.split("&state=")[0];
              isLoginwx(locationCode, "/h5/views/wheel/wheel.html");
            }
            nav.setActiveNav("discover");
            $(".async").asyncload();
            $("#myloading").remove();

            //分享
            weixin
              .setTitle("聚米众筹天天转盘，富力转不停")
              .setDesc()
              .setImg()
              .setUrl(location.origin + "/h5/views/wheel/wheel.html")
              .share();
          }
        });
      }
    }
  });
});
