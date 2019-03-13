define(["vue", "weixin"], function(vue, weixin) {
  new vue({
    el: "body",
    components: {
      "nation-act": {
        template: "#nationActTemplate",
        data: function() {
          return {
            shareTitle: "国庆“豪”礼相随!",
            shareContent: "iPhone XS Max已备好，不进来看看吗?",
            sharePic:
              "https://jumifinancetest.oss-cn-hangzhou.aliyuncs.com/jumifinancetest/uploadFile/images/activity/act-share.jpg",
            shareUrl: location.origin + "/h5/views/activity/activity.html"
          };
        },
        methods: {
          preventDefaultz: function(e) {
            e.preventDefault();
            return false;
          },
          goZz: function() {
            location.href =
              location.origin +
              "/h5/views/main/list.html?type=0&status=0&itemName=";
          }
        }
      } //summer-act的结束
    }, //components的结束
    ready: function() {
      $("#myloading").remove();
      var that = this;
      weixin
        .setTitle(that.$children[0].shareTitle)
        .setDesc(that.$children[0].shareContent)
        .setImg(that.$children[0].sharePic)
        .setUrl(that.$children[0].shareUrl)
        .share();
    }
  }); //new Vue的结束
});
