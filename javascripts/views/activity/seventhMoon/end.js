define([
  "jquery",
  "isLogin",
  "isLoginwx",
  "vue",
  "Swiper",
  "swiperanimate",
  "F2",
  "qrcode",
  "jumi",
  "wx",
  "weixin",
  "getPara",
  "screenControl"
], function(
  $,
  isLogin,
  isLoginwx,
  vue,
  Swiper,
  swiperanimate,
  F2,
  qrcode,
  jumi,
  wx,
  weixin,
  getPara,
  screenControl
) {
  var para = getPara.get();
  var token = localStorage.getItem("token"); //判断是否是新用户
  var parainit = {
    token: token,
    requestSource: "WAP"
  };
  $.ajax({
    url: "/doubleSevenDay/createKeyword",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      //   console.log(data);
      if (data.code === "0000") {
        new vue({
          el: "body",
          components: {
            "my-end": {
              template: "#endTemplate",
              data: function() {
                return {
                  data: data.data,
                  intimateDegree: data.data.intimateDegree, //亲密程度
                  honeyedWords: data.data.honeyedWords, //七夕情话
                  invitorUserId: data.data.userId
                };
              },
              methods: {
                animationInit: function() {
                  var mySwiper = new Swiper(".swiper-container", {
                    on: {
                      init: function() {
                        swiperAnimateCache(this); //隐藏动画元素
                        swiperAnimate(this); //初始化完成开始动画
                      },
                      slideChangeTransitionEnd: function() {
                        swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
                      }
                    }
                  });
                },
                radarInit: function() {
                  var that = this;
                  // F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
                  var data = [
                    {
                      name: "投资总额",
                      value: that.data.inveTolAmtSce
                    },
                    {
                      name: "邀请好友数",
                      value: that.data.inviFriNumSce
                    },
                    {
                      name: "投资频率",
                      value: that.data.inveHzSce
                    },
                    {
                      name: "投资项目数",
                      value: that.data.inveItemNumSce
                    },
                    {
                      name: "注册时间",
                      value: that.data.regiTimeSce
                    }
                  ];

                  // Step 1: 创建 Chart 对象
                  var chart = new F2.Chart({
                    id: "mountNode",
                    pixelRatio: window.devicePixelRatio
                  });
                  // Step 2: 载入数据源,为 chart 装载数据，返回 chart 对象。
                  chart.source(data, {
                    value: {
                      min: 0,
                      max: 5
                    }
                  });
                  //  该方法是设置坐标系的类型，一共是4各参数（polar:极坐标系，由角度和半径 2 个维度构成。radius设置半径，值范围为 0 至 1）
                  chart.coord("polar");
                  chart.tooltip(false); // 配置提示信息,关闭 tooltip
                  //axis坐标轴配置，该方法返回 chart 对象。
                  chart.axis("value", {
                    grid: {
                      lineDash: null // 网格线的虚线配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
                    },
                    label: null, //设置坐标轴文本的样式。如果该属性值为 null 则表示不展示坐标轴文本。
                    line: null
                  });
                  chart.axis("name", {
                    grid: {
                      lineDash: null
                    }
                  });

                  //legend配置图表图例。
                  //创建区域图
                  chart
                    .area()
                    .position("name*value")
                    .color("#f9a993")
                    .style({
                      fillOpacity: 0.6
                    })
                    .animate({
                      appear: {
                        animation: "groupWaveIn"
                      }
                    });
                  //创建线图
                  chart
                    .line()
                    .position("name*value")
                    .color("#f9a993")
                    .size(1)
                    .animate({
                      appear: {
                        animation: "groupWaveIn"
                      }
                    });
                  //创建点图图
                  chart
                    .point()
                    .position("name*value")
                    .color("#f9a993")
                    .size(1);
                  // Step 4: 渲染图表
                  chart.render();
                },
                qrcodeInit: function() {
                  var that = this;
                  var hostName = location.host.split(".")[0];
                  //利用插件生成二维码,生成的二维码在canvas中
                  $("#qrcodeDiv").qrcode({
                    render: "canvas", //canvas方式
                    width: 88, //宽度
                    height: 88, //高度
                    text:
                      "https://" +
                      hostName +
                      ".jumizc.com/h5/views/activity/seventhMoon/start.html?invitorUserId=" +
                      that.invitorUserId
                  });
                  //从canvas中提取图片image
                  function convertCanvasToImage(canvas) {
                    //新Image对象，可以理解为DOM
                    var image = new Image();
                    // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
                    // 指定格式PNG
                    image.src = canvas.toDataURL("image/png");
                    return image;
                  }

                  //获取网页中的canvas对象
                  var mycanvas1 = document.getElementsByTagName("canvas")[1];

                  //将转换后的img标签插入到html中
                  var img = convertCanvasToImage(mycanvas1);
                  $("#imgDiv").html(img); //imgDiv表示你要插入的容器id
                },
                screenshot: function() {
                  jumi.tips("分享此页面截图给好友<br />扫描二维码即可参加！");
                },
                pauseMusic: function() {
                  var that = this;
                  that.musicGopause = !that.musicGopause;
                  var oAudio = document.getElementById("audio");
                  if (that.musicGopause) {
                    oAudio.pause();
                    $("#music-off").removeClass("musicAnimate");
                    $("#noMusic").show();
                  } else {
                    oAudio.play();
                    $("#music-off").addClass("musicAnimate");
                    $("#noMusic").hide();
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
                isAndroid: function() {
                  var u = navigator.userAgent;
                  if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
                    return true;
                  }
                },
                upperPagecurtime: function() {
                  var that = this;
                  var oAudio = document.getElementById("audio");
                  if (that.isAndroid()) {
                    oAudio.currentTime = para.musicCurtime; //微信浏览器，安卓兼容写法
                  } else {
                    oAudio.addEventListener("canplay", function() {
                      oAudio.currentTime = para.musicCurtime; //微信浏览器，ios兼容写法
                    });
                  }
                }
              }
            }
          },
          ready: function() {
            $("#myloading").remove();
            var that = this;
            var oAudio = document.getElementById("audio");
            that.$children[0].animationInit();
            that.$children[0].radarInit();
            that.$children[0].qrcodeInit();

            if (para.musicClose == "true") {
              //从上个页面进来的时候，音乐时关闭状态的。
              oAudio.pause();
              $("#music-off").removeClass("musicAnimate");
              $("#noMusic").show();
            } else {
              //开始播放动画
              that.$children[0].musicAutoplayWx(); //兼容ios写法
              oAudio.play();
              $("#music-off").addClass("musicAnimate");
              $("#noMusic").hide();
              that.$children[0].upperPagecurtime(); //微信浏览器，ios兼容写法,安卓兼容写法
            }

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
          }
        }); //end vue
      } //if  end
    } //success  end
  }); // ajax  end
});
