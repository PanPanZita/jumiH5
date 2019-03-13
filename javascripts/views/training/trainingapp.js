define(["jumi", "weixin", "getPara", "vue"], function(
  jumi,
  weixin,
  getPara,
  vue
) {
  var token = localStorage.getItem("token"); //判断是否是新用户
  var shareUrl = location.href;
  var parainit = {
    itemId: 1,
    requestSource: "WAP"
  };
  $.ajax({
    url: "/item/getItemBasicInfo",
    type: "post",
    dataType: "json",
    data: parainit,
    success: function(data) {
      // console.log(data);
      if (data.code == "0000") {
        new vue({
          el: "body",
          components: {
            "my-item": {
              template: "#itemTemplate",
              data: function() {
                return {
                  data: data.data,
                  noviceStatus: data.data.noviceStatus //是否开启状态0:未开启；1：已开启
                };
              },
              filters: {
                tenthousand: function(value) {
                  if (value >= 10000) {
                    return value / 10000 + " 万元";
                  } else {
                    return value + " 元";
                  }
                }
              }
            }
          },
          ready: function() {
            var that = this;
            // console.log(that);   //如果没有和components同级，和methods同级，打印出来的this是指vue...
            // console.log(data);

            var intervalId = 0;
            if (
              that.$children[0].data.investPhoneList &&
              that.$children[0].data.investPhoneList.length > 1
            ) {
              intervalId = setInterval(function() {
                var liFirst = $("#slider li:first");
                var liSecond = $("#slider li").eq(1);
                var liLast = $("#slider li:last");
                liFirst.animate({ opacity: 0 }, 1000, function() {
                  liFirst.insertAfter(liLast);
                  liSecond.animate({ opacity: 1 }, 1000);
                });
              }, 3000);
            }

            if (localStorage.fromapp == "ios") {
              var o = {
                title: that.$children[0].data.shareTitle,
                desc: that.$children[0].data.shareContent,
                img: that.$children[0].data.sharePic,
                url: shareUrl
              };
              window.webkit.messageHandlers.share.postMessage(o);
            } else if (localStorage.fromapp == "android") {
              var o = {
                title: that.$children[0].data.shareTitle,
                desc: that.$children[0].data.shareContent,
                img: that.$children[0].data.sharePic,
                url: shareUrl
              };
              window.Android.callAndroidAction("0", JSON.stringify(o));
            } else {
              weixin
                .setTitle(that.$children[0].data.shareTitle)
                .setDesc(that.$children[0].data.shareContent)
                .setImg(that.$children[0].data.sharePic)
                .setUrl(shareUrl)
                .share(true);
            }
          }
        });
      }
    }
  });
});
