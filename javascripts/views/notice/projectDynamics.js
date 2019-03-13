define(["jumi", "nav", "weixin", "vue", "getPara", "DateFormat"], function (
    jumi,
    nav,
    weixin,
    vue,
    getPara,
    DateFormat
) {
    var para = getPara.get();
    var preType = para.preType ? para.preType : 0; //页面类型0正常页面1预览页面
    $.ajax({
        url: "/notice/information/getNoticeById",
        type: "post",
        dataType: "json",
        data: { noticeId: para.inforId, requestSource: "WAP", preType: preType },
        success: function (data) {
            // console.log(data);
            new vue({
                el: "body",
                components: {
                    "my-dynamic": {
                        template: "#dynamicTemplate",
                        data: function () {
                            return {
                                data: data.data,
                                itemBasicInfoResVO: data.data ? data.data.itemBasicInfoResVO : {},
                                jmNotice: data.data ? data.data.jmNotice : {},
                                jmNoticeText: data.data ? data.data.jmNoticeText : {},
                                jmNotices: data.data ? data.data.jmNotices : {},
                                idz: para.inforId
                            };
                        },
                        methods: {
                            listDetails: function (index) {
                                var inforId = this.jmNotices[index].id;
                                location.href =
                                    "/h5/views/notice/projectDynamics.html?inforId=" + inforId;
                            }
                        },
                        filters: {
                            timeStr: function (timeStr) {
                                return new Date(timeStr).Format("yyyy-MM-dd hh:mm");
                            }
                        }
                    }
                },
                ready: function () {
                    nav.setActiveNav("index");
                    $("#myloading").remove();
                    var that = this;
                    var title = that.$children[0].jmNotice.title;

                    if (that.$children[0].jmNotice.headDescription) {
                        $("meta[name='description']").attr(
                            "content",
                            that.$children[0].jmNotice.headDescription
                        );
                    }

                    if (that.$children[0].jmNotice.headKeyword) {
                        $("meta[name='keywords']").attr(
                            "content",
                            that.$children[0].jmNotice.headKeyword
                        );
                    }

                    if (that.$children[0].jmNotice.headTitle) {
                        $("title").text(that.$children[0].jmNotice.headTitle);
                    }

                    //分享
                    weixin
                        .setTitle(title)
                        .setDesc()
                        .setImg()
                        .setUrl()
                        .share();
                }
            });
        }
    });
});
