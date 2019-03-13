define(["jquery", "vue", "weixin"], function($, vue, weixin) {
  new vue({
    el: "body",
    components: {
      "my-gardenparty": {
        template: "#gardenPartyTemplate",
        data: function() {
          return {
            data: {}
          };
        }
      }
    },
    ready: function() {
      $("#myloading").remove();

      var o = {
        title: "聚米两周年庆！史上最大力度活动来袭！",
        desc:
          "黄金条，液晶电视，无人机...超多壕礼等你来拿，转盘100%中奖！更有价值6188元大奖送给你！",
        img:
          "https://jumifinance.oss-cn-hangzhou.aliyuncs.com/investdetail/1491361901378054729.jpg",
        url: "jumizc.com/h5/views/activity/anniversaryNewUser.html"
      };
      if (localStorage.fromapp == "ios") {
        var a = decodeURIComponent(location.href.split("#")[0]);
        a = a.split(".")[0];
        a = a.split("//")[1];
        var b = "https://" + a + ".";
        o.url = b + o.url;

        window.webkit.messageHandlers.share.postMessage(o);
      } else if (localStorage.fromapp == "android") {
        var a = decodeURIComponent(location.href.split("#")[0]);
        a = a.split(".")[0];
        a = a.split("//")[1];
        var b = "https://" + a + ".";
        o.url = b + o.url;

        window.Android.callAndroidAction("0", JSON.stringify(o));
      } else {
        weixin
          .setTitle(o.title)
          .setDesc(o.desc)
          .setImg(o.img)
          .setUrl(o.url)
          .share(true);
      }
    }
  });
});
