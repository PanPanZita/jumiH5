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
        title: "当别人还在送钱送红包的时候，我们已经在教你怎么赚钱了!",
        desc: "当然，我们也送红包，还比他们的大",
        img:
          "https://jumifinance.oss-cn-hangzhou.aliyuncs.com/investdetail/1485153670361023362.jpg",
        url: "jumizc.com/h5/views/activity/gardenParty.html"
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
