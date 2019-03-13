/*
 * 功能：微信分享
 * 使用：weixin.setTitle(data.title)
				   .setDesc(data.desc)
				   .setImg(data.img)
				   .setUrl(data.url)
				   .share(true);//true：创建红包分享记录和前置红包记录。//false：不创建......
 * */
define(["wx", "jumi"], function(wx, jumi) {
  var a = decodeURIComponent(location.href.split("#")[0]);
  a = a.split(".")[0];
  a = a.split("//")[1];
  var my = {
    //默认值
    defaults: {
      sharetitle: "投资享收益,娱乐玩不停!尽在聚米众筹!",
      sharedesc: "安全、专业的文化众筹社区\r\nwww.jumizc.com",
      shareimg:
        "https://jumifinance.oss-cn-hangzhou.aliyuncs.com/20150701001719597164680.jpg",
      shareurl: "https://" + a + ".jumizc.com/h5/views/main/index.html"
    },
    //设置主标题
    setTitle: function() {
      if (arguments[0]) {
        my.defaults.sharetitle = arguments[0];
      }
      return this;
    },
    //设置描述
    setDesc: function() {
      if (arguments[0]) {
        my.defaults.sharedesc = arguments[0];
      }
      return this;
    },
    //设置图片
    setImg: function() {
      if (arguments[0]) {
        my.defaults.shareimg = arguments[0];
      }
      return this;
    },
    //设置链接地址
    setUrl: function() {
      if (arguments[0]) {
        my.defaults.shareurl = arguments[0];
      }
      return this;
    },
    //-判断是否是微信浏览器
    isWeixin: function() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    //分享
    share: function() {
      var args = arguments;
      var url = decodeURIComponent(location.href.split("#")[0]);
      var token = localStorage.getItem("token"); //为了验证用户是否登录
      // var paraMidautumn = {
      //     token: token,
      //     requestSource: "WAP"
      // };
      var para = {
        url: url,
        requestSource: "WAP"
      };
      var paraintegral = {
        money: 0,
        sourceType: 4,
        token: token,
        requestSource: "WAP"
      };
      // console.log(paraintegral);
      if (my.isWeixin()) {
        $.ajax({
          url: "/weixin/initJs",
          type: "post",
          dataType: "json",
          data: para,
          success: function(data) {
            if (data.code == "0000") {
              // console.log(data);
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.data.appId, // 'gh_784eadfde93c', // 必填，公众号的唯一标识
                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.noncestr, // 必填，生成签名的随机串
                signature: data.data.signature, // 必填，签名，见附录1
                jsApiList: [
                  "onMenuShareTimeline",
                  "onMenuShareAppMessage",
                  "onMenuShareQQ",
                  "onMenuShareWeibo",
                  "chooseImage",
                  "previewImage",
                  "getNetworkType",
                  "scanQRCode",
                  "chooseWXPay"
                ]
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
            } else {
              console.log("errorMsg============================" + data.msg);
            }
          },
          error: function() {
            //							console.log("ajax error.");
          }
        });
      }

      wx.ready(function() {
        wx.onMenuShareTimeline({
          //分享到朋友圈
          title: my.defaults.sharetitle, // 分享标题
          link: my.defaults.shareurl, // 分享链接
          imgUrl: my.defaults.shareimg, // 分享图标
          success: function() {
            if (window["ShareCallback"]) {
              window["ShareCallback"]();
            }
            // if (args[0] == "midAutumnActivity") {
            //     $.ajax({
            //         url: "/moonFetivalActivity/shareLightWord",
            //         type: "post",
            //         dataType: "json",
            //         data: paraMidautumn,
            //         success: function (data) {
            //             //   alert("分享成功");
            //             location.reload();
            //         },
            //         error: function () {
            //             location.reload();
            //         }
            //     });
            // }
            if (args[0] == true) {
              // 要求是"投资详情页面"的时候才会调用此接口,我会在投资详情页面的share传一个true.这个页面是当用户分享到朋友圈的是否加积分
              $.ajax({
                url: "/common/addUserPoints",
                type: "post",
                dataType: "json",
                data: paraintegral,
                success: function(data) {
                  //   alert("分享成功");
                  jumi.tips("分享成功！");
                },
                error: function() {}
              });
            }
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          //分享给朋友
          title: my.defaults.sharetitle, // 分享标题
          desc: my.defaults.sharedesc, // 分享描述
          link: my.defaults.shareurl, // 分享链接
          imgUrl: my.defaults.shareimg, // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // alert(my.defaults.shareurl);
            if (window["ShareCallback"]) {
              window["ShareCallback"]();
            }
            if (args[0] == true) {
              // 要求是"投资详情页面"的时候才会调用此接口,我会在投资详情页面的share传一个true.
              $.ajax({
                url: "/common/addUserPoints",
                type: "post",
                dataType: "json",
                data: paraintegral,
                success: function(data) {
                  // alert("该页面是投资页面！");
                },
                error: function() {}
              });
            }
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareQQ({
          //分享到qq
          title: my.defaults.sharetitle, // 分享标题
          desc: my.defaults.sharedesc, // 分享描述
          link: my.defaults.shareurl, // 分享链接
          imgUrl: my.defaults.shareimg, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareWeibo({
          //分享到腾讯微博
          title: my.defaults.sharetitle, // 分享标题
          desc: my.defaults.sharedesc, // 分享描述
          link: my.defaults.shareurl, // 分享链接
          imgUrl: my.defaults.shareimg, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
      });
      wx.error(function(res) {
        //					console.log(res);
      });
      return this;
    }
  };

  return my;
});
