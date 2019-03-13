define([
  "jquery",
  "vue",
  "Swiper",
  "swiperanimate",
  "wx",
  "weixin",
  "screenControl"
], function($, vue, Swiper, swiperanimate, wx, weixin, screenControl) {
  var token = localStorage.getItem("token"); //判断是否是新用户
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  $.ajax({
    url: " /doubleSevenDay/getInvestDataStatis",
    type: "get",
    dataType: "json",
    data: parainit,
    success: function(data) {
      // console.log(data);
      if (data.code === "0000") {
        new vue({
          el: "body",
          components: {
            "my-report": {
              template: "#reportTemplate",
              data: function() {
                return {
                  data: data.data,
                  musicGopause: false, //这个参数声明的意义就在于，初始化进入到页面后，点击音乐即暂停
                  hasInvest: data.data.hasInvest, //判断是否投资过项目
                  firItemName: data.data.firItemName, // 投资的第一个项目名称
                  dayStr: 0,
                  musicClose: false //携带到结束页面的音乐状态，是否开启或者关闭（默认开启音乐）
                };
              },
              methods: {
                numRollnumber: function(digit) {
                  //释义：digit必须是字符串
                  var num_arr = [];
                  for (var i = 0; i < digit.length; i++) {
                    num_arr.push(digit.charAt(i));
                  }
                  return num_arr;
                },
                numRolldom: function(arr) {
                  var str = "";
                  for (var i = 0; i < arr.length; i++) {
                    //判断是不是数值
                    if (parseInt(arr[i]) >= 0) {
                      str +=
                        '<div class="l js-l-box digit-container" data-show=' +
                        arr[i] +
                        ">" +
                        "<span>0</span>" +
                        "<span>1</span>" +
                        "<span>2</span>" +
                        "<span>3</span>" +
                        "<span>4</span>" +
                        "<span>5</span>" +
                        "<span>6</span>" +
                        "<span>7</span>" +
                        "<span>8</span>" +
                        "<span>9</span>" +
                        "</div>";
                    } else {
                      if (arr[i] === ".") {
                        str +=
                          '<div class="signDot-box l"><span>' +
                          arr[i] +
                          "</span></div>";
                      } else {
                        str +=
                          '<div class="sign-box l"><span>' +
                          arr[i] +
                          "</span></div>";
                      }
                    }
                  }
                  return str;
                },
                numRollanimation: function() {
                  var height = $(".date-box").height();
                  $(".js-l-box").each(function(i) {
                    var num = parseInt($(this).data("show"));
                    var scrollTop = 0;
                    var scrollTop = height * num;
                    $(this).css("margin-top", 0);
                    $(this).animate({ marginTop: -scrollTop }, 1500);
                  });
                },
                pageOnenumRoll: function() {
                  var that = this;
                  var finalDate_arr = that.numRollnumber(that.data.regiTime);
                  $(".date-box").html(that.numRolldom(finalDate_arr));
                  var finalOrder_arr = that.numRollnumber(
                    "第" + that.data.regiSeq + "个"
                  );
                  $(".order-box").html(that.numRolldom(finalOrder_arr));
                  that.numRollanimation();

                  var dateStr = that.data.regiTime;
                  var dateStrLine =
                    dateStr.substr(0, 4) +
                    "-" +
                    dateStr.substr(5, 2) +
                    "-" +
                    dateStr.substr(8, 2);
                  var date = new Date(dateStrLine);
                  var currentDate = new Date();
                  var backstageTime = date.getTime(); //后台传给我的时间
                  var currentTime = currentDate.getTime(); //当前时间
                  //   (24*60*60*1000) =  86400000
                  var day = Math.ceil((currentTime - backstageTime) / 86400000);
                  that.dayStr = day;
                },
                pageTwonumRoll: function() {
                  var that = this;
                  if (that.data.firItemInvestAmt) {
                    var finalMoney_arr = that.numRollnumber(
                      that.data.firItemInvestAmt + "元"
                    );
                    $(".money-box").html(that.numRolldom(finalMoney_arr));
                    that.numRollanimation();
                  }
                },
                pageThreenumRoll: function() {
                  var that = this;
                  var finalItemAmount_arr = that.numRollnumber(
                    that.data.investItemNum + "个"
                  );
                  $(".itemAmount-box").html(
                    that.numRolldom(finalItemAmount_arr)
                  );
                  var totalNum = parseFloat(that.data.investTotalAmt / 10000);

                  var finalTotalMoney_arr = that.numRollnumber(
                    totalNum + "万元"
                  );
                  $(".totalMoney-box").html(
                    that.numRolldom(finalTotalMoney_arr)
                  );

                  var finalSingleMoney_arr = that.numRollnumber(
                    that.data.maxItemInvestAmt + "元"
                  );
                  $(".singleMoney-box").html(
                    that.numRolldom(finalSingleMoney_arr)
                  );

                  that.numRollanimation();
                },
                pageFournumRoll: function() {
                  var that = this;
                  var finalAccompany_arr = that.numRollnumber(
                    "第" + that.dayStr + "天"
                  );
                  $(".accompany-box").html(that.numRolldom(finalAccompany_arr));
                  var finalAlreadyGet_arr = that.numRollnumber(
                    that.data.earnedIncome + "元"
                  );
                  $(".alreadyGet-box").html(
                    that.numRolldom(finalAlreadyGet_arr)
                  );
                  var finalTobeCollected_arr = that.numRollnumber(
                    that.data.collPrincipal + "元"
                  );
                  $(".tobeCollected-box").html(
                    that.numRolldom(finalTobeCollected_arr)
                  );
                  that.numRollanimation();
                },
                pauseMusic: function() {
                  var that = this;
                  that.musicGopause = !that.musicGopause;
                  var oAudio = document.getElementById("audio");
                  if (that.musicGopause) {
                    oAudio.pause();
                    $("#music-off").removeClass("musicAnimate");
                    $("#noMusic").show();
                    that.musicClose = true;
                  } else {
                    oAudio.play();
                    $("#music-off").addClass("musicAnimate");
                    $("#noMusic").hide();
                    that.musicClose = false;
                  }
                },
                //   兼容ios设备，必须有触发事件才会响应播放音频
                musicAutoplayWx: function() {
                  wx.config({
                    // 配置信息, 即使不正确也能使用 wx.ready
                    debug: false,
                    appId: "",
                    timestamp: 1,
                    nonceStr: "",
                    signature: "",
                    jsApiList: []
                  });
                  wx.ready(function() {
                    document.getElementById("audio").play();
                  });
                },
                hrefKeyword: function() {
                  var that = this;
                  var oAudio = document.getElementById("audio");
                  location.href =
                    "end.html?musicClose=" +
                    that.musicClose +
                    "&musicCurtime=" +
                    oAudio.currentTime;
                }
              }
            }
          },
          ready: function() {
            var that = this;
            $("#myloading").remove();

            //开始播放音乐
            var oAudio = document.getElementById("audio");
            that.$children[0].musicAutoplayWx(); //1.兼容ios手机，微信浏览器写法
            //2.兼容安卓手机，微信浏览器写法
            oAudio.play();
            $("#music-off").addClass("musicAnimate");

            //   引入swiper的时候必须要大写S,即引入的形式是Swiper.否则会报错!swiperanimate不需要大写
            //   执行动画
            var mySwiper = new Swiper(".swiper-container", {
              direction: "vertical",
              on: {
                init: function() {
                  swiperAnimateCache(this); //隐藏动画元素
                  swiperAnimate(this); //初始化完成开始动画
                  if (this.activeIndex == 0) {
                    that.$children[0].pageOnenumRoll();
                  }
                },
                slideChangeTransitionEnd: function() {
                  swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
                  //   数字滚动
                  if (this.activeIndex == 0) {
                    that.$children[0].pageOnenumRoll();
                  }
                  if (this.activeIndex == 1) {
                    that.$children[0].pageTwonumRoll();
                  }
                  if (this.activeIndex == 2) {
                    that.$children[0].pageThreenumRoll();
                  }
                  if (this.activeIndex == 3) {
                    that.$children[0].pageFournumRoll();
                  }
                }
              }
            });

            //分享
            var o = {
              title: "一份来自聚小米的情书",
              desc: "等我遇见你，点亮你的自由人生。",
              img:
                "https://jumifinancetest.oss-cn-hangzhou.aliyuncs.com/itemDetail/1533784371641002350.jpg",
              url: location.origin + "/h5/views/activity/seventhMoon/start.html"
            };

            weixin
              .setTitle(o.title)
              .setDesc(o.desc)
              .setImg(o.img)
              .setUrl(o.url)
              .share();
          } //ready的结束
        }); //vue的结束
      } //code的结束
    } //success的结束
  }); //ajax的结束
});
