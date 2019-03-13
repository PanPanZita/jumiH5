define([
  "jumi",
  "nav",
  "weixin",
  "vue",
  "asyncload",
  "load",
  "scrolltotop"
], function(jumi, nav, weixin, vue, asyncload, load, scrolltotop) {
  var params = {
    pageNum: 1,
    pageSize: 15,
    requestSource: "WAP"
  };
  $.ajax({
    url: "/notice/information/getNoticeList",
    type: "post",
    dataType: "json",
    data: params,
    success: function(data) {
      // console.log(data);
      if (data.code == "0000") {
        if (
          data.data != null &&
          data.data.noticeList != null &&
          data.data.noticeList.length > 0
        ) {
          new vue({
            el: "body",
            components: {
              "my-information": {
                template: "#informationTemplate",
                data: function() {
                  return {
                    inforlists: data.data.noticeList,
                    pageNum: 1,
                    pageSize: 15,
                    isLoading: 0
                  };
                },
                methods: {
                  listDetails: function(index) {
                    var inforId = this.inforlists[index].id; //获取资讯主键id
                    if (this.inforlists[index].type == 0) {
                      //平台公告
                      location.href =
                        "/h5/views/notice/announcement.html?inforId=" + inforId;
                    } else if (this.inforlists[index].type == 1) {
                      //项目动态
                      location.href =
                        "/h5/views/notice/projectDynamics.html?inforId=" +
                        inforId;
                    } else if (this.inforlists[index].type == 2) {
                      //媒体报道
                      if (this.inforlists[index].mediaType == 1) {
                        location.href =
                          "/h5/views/notice/mediaReport.html?inforId=" +
                          inforId;
                      } else if (this.inforlists[index].mediaType == 2) {
                        location.href =
                          this.inforlists[index].linkUrl +
                          "?inforId=" +
                          inforId;
                      }
                    }
                  }
                }
              }
            },
            ready: function() {
              var that = this;
              nav.setActiveNav("index");
              $("#myloading").remove();

              //分享
              weixin
                .setTitle()
                .setDesc()
                .setImg()
                .setUrl()
                .share();

              //上拉刷新-加载更多记录
              load.pullup({
                button: "#loadMoreButton",
                callback: function(options) {
                  var component = that.$children[0];

                  options.pageNum++;

                  var paraload = {
                    pageSize: 15,
                    pageNum: options.pageNum,
                    requestSource: "WAP"
                  };

                  $.ajax({
                    url: "/notice/information/getNoticeList",
                    type: "post",
                    dataType: "json",
                    data: paraload,
                    success: function(data) {
                      if (data.code == "0000") {
                        if (
                          data.data != null &&
                          data.data.noticeList != null &&
                          data.data.noticeList.length > 0
                        ) {
                          for (
                            var i = 0;
                            i < data.data.noticeList.length;
                            i++
                          ) {
                            component.inforlists.push(data.data.noticeList[i]);
                          }
                          setTimeout(function() {
                            $(".async").asyncload();
                          }, 0);

                          options.isLoading = 0;
                        } else {
                          options.isLoading = 2;
                          $(options.button).html("-- 我已倾囊相授 --");
                        }
                      }
                    }
                  });
                }
              });
            }
          });
        } else {
          nav.setActiveNav("index");
          $("#myloading").remove();

          //分享
          weixin
            .setTitle()
            .setDesc()
            .setImg()
            .setUrl()
            .share();
        }
      } else {
        jumi.tips(data.msg);
      }
    }
  });
});
