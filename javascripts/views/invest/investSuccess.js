define(["getPara", "weixin", "vue"], function(getPara, weixin, vue) {
  var para = getPara.get();
  var itemid = para.itemid;
  var investBillId = para.investBillId;
  var parainit = {
    requestSource: "WAP",
    investBillId: investBillId
  };
  $.ajax({
    url: "/buy/getActivityRecommend",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      // console.log(data);
      if (data.code == "0000") {
        new vue({
          el: "body",
          components: {
            "my-success": {
              template: "#successTemplate",
              data: function() {
                return {
                  data: data.data,
                  isShow: data.data.amount == 0 ? false : true, //红包判断(false为没有配置红包不可以分享，true为显示出来可以分享红包)
                  is_novice_item: itemid == 1 ? true : false //是否是新手训练营
                };
              },
              methods: {
                //发红包
                show: function() {
                  this.isShow = true;
                },
                //隐藏
                hide: function() {
                  this.isShow = false;
                }
              }
            }
          },
          ready: function() {
            $("#myloading").remove();
            var that = this; //windows
            // console.log(that);
            // alert(that.$children[0].data.amount);
            //分享
            if (that.$children[0].data.amount > 0) {
              //如果项目配置了可分享红包则可以分享
              if (localStorage.fromapp == "ios") {
                var o = {
                  title: that.$children[0].data.shareTitle,
                  desc: that.$children[0].data.shareContent,
                  img: that.$children[0].data.sharePic,
                  url: that.$children[0].data.shareUrl
                };
                window.webkit.messageHandlers.share.postMessage(o);
              } else if (localStorage.fromapp == "android") {
                var o = {
                  title: that.$children[0].data.shareTitle,
                  desc: that.$children[0].data.shareContent,
                  img: that.$children[0].data.sharePic,
                  url: that.$children[0].data.shareUrl
                };
                window.Android.callAndroidAction("0", JSON.stringify(o));
              } else {
                weixin
                  .setTitle(that.$children[0].data.shareTitle)
                  .setDesc(that.$children[0].data.shareContent)
                  .setImg(that.$children[0].data.sharePic)
                  .setUrl(that.$children[0].data.shareUrl)
                  .share();
              }
            }
          }
        });
      }
    }
  });
});
