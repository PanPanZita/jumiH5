define(["jumi", "nav", "weixin", "vue", "asyncload", "getPara"], function(
  jumi,
  nav,
  weixin,
  vue,
  asyncload,
  getPara
) {
  var para = getPara.get();
  var preType = para.preType ? para.preType : 0; //页面类型0正常页面1预览页面
  $.ajax({
    url: "/notice/information/getNoticeText",
    type: "post",
    dataType: "json",
    data: { noticeId: para.inforId, requestSource: "WAP", preType: preType },
    success: function(data) {
      // console.log(data);
      new vue({
        el: "body",
        components: {
          "my-announcement": {
            template: "#announcementTemplate",
            data: function() {
              return {
                data: data.data,
                idz: para.inforId
              };
            }
          }
        },
        ready: function() {
          $("#myloading").remove();
          var that = this;
          var title = that.$children[0].data.title;

          if (that.$children[0].data.headDescription) {
            $("meta[name='description']").attr(
              "content",
              that.$children[0].data.headDescription
            );
          }

          if (that.$children[0].data.headKeyword) {
            $("meta[name='keywords']").attr(
              "content",
              that.$children[0].data.headKeyword
            );
          }

          if (that.$children[0].data.headTitle) {
            $("title").text(that.$children[0].data.headTitle);
          }

          //分享
          weixin
            .setTitle(title)
            .setDesc()
            .setImg()
            .setUrl(location.href)
            .share();
        }
      });
    }
  });
});
