define(["getPara", "weixin", "vue", "getPara"], function(
  getPara,
  weixin,
  vue,
  getPara
) {
  var para = getPara.get();
  var errorMessage = decodeURI(para.errorMessage);
  var itemid = para.itemid;
  new vue({
    el: "body",
    components: {
      "my-fail": {
        template: "#failTemplate",
        data: function() {
          return {
            errorMessage: errorMessage,
            itemid: itemid
          };
        },
        methods: {
          //返回首页
          backindex: function() {
            location.href = "/h5/views/main/index.html";
          },
          //重新支持新手训练营
          trynew: function() {
            location.href = "/h5/views/training/training.html";
          },
          //重新支持
          try: function() {
            location.href =
              "/h5/views/invest/investGrade.html?itemid=" + itemid;
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
});
