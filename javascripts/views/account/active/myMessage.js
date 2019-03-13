define([
    "jumi",
    "nav",
    "tab",
    "vue",
    "scrolltotop",
    "isLogin",
    "isLoginwx",
    "asyncload",
    "weixin",
    "load"
], function (
    jumi,
    nav,
    tab,
    vue,
    scrolltotop,
    isLogin,
    isLoginwx,
    asyncload,
    weixin,
    load
) {
        var token = localStorage.getItem("token");
        var parainit = {
            currentPage: 1,
            pageSize: 10,
            token: token,
            requestSource: "WAP"
        };
        isLogin(function () {
            $.ajax({
                url: "/comment/personComment/v1.0",
                type: "get",
                // dataType: "json",
                data: parainit,
                success: function (data) {
                    if (data.code == "0000") {
                        new vue({
                            el: "body",
                            components: {
                                "my-message": {
                                    template: "#messageTemplate",
                                    data: function () {
                                        return {
                                            messageList: data.data,
                                            isLoading: 0
                                        };
                                    },
                                    methods: {
                                        activeHref: function (item) {
                                            var typez = item.commentType,
                                                programId = item.itemId,
                                                commentId = item.id,
                                                answerzHref = null;
                                            switch (typez) {
                                                case 3:
                                                    // 项目详情
                                                    answerzHref = "/h5/views/invest/investComment.html?itemid=" + programId + "&commentType=3#cid" + commentId;
                                                    break;
                                                case 2:
                                                    // 新闻报道
                                                    answerzHref = "/h5/views/invest/investComment.html?itemid=" + programId + "&commentType=2#cid" + commentId;
                                                    break;
                                                case 1:
                                                    // 项目动态
                                                    answerzHref = "/h5/views/invest/investComment.html?itemid=" + programId + "&commentType=1#cid" + commentId;
                                                    break;
                                                case 0:
                                                    // 平台公告
                                                    answerzHref = "/h5/views/invest/investComment.html?itemid=" + programId + "&commentType=0#cid" + commentId;
                                                    break;
                                                default:
                                                    break;
                                            }
                                            return answerzHref;
                                        }
                                    }
                                }
                            },
                            ready: function () {
                                //微信登陆--该链接后面不带参数
                                var url = location.href.split("?code=")[0];
                                var locationCodepar = location.href.split("?code=")[1];
                                if (locationCodepar) {
                                    var locationCode = locationCodepar.split("&state=")[0];
                                    isLoginwx(locationCode, url);
                                }
                                var that = this;
                                $("#myloading").remove();
                                // 上拉刷新-加载更多
                                load.pullup({
                                    button: "#loadMoreButton",
                                    callback: function (options) {
                                        var component = that.$children[0].messageList;
                                        options.currentPage++;
                                        var paraload = {
                                            pageSize: 10,
                                            currentPage: options.currentPage,
                                            requestSource: "WAP",
                                            token: token
                                        };
                                        $.ajax({
                                            url: "/comment/personComment/v1.0",
                                            type: "get",
                                            dataType: "json",
                                            data: paraload,
                                            success: function (data) {
                                                if (data.code == "0000") {
                                                    if (data.data && data.data.length > 0) {
                                                        for (var i = 0, dLength = data.data.length; i < dLength; i++) {
                                                            component.push(data.data[i]);
                                                        }
                                                        setTimeout(function () {
                                                            $(".async").asyncload();
                                                        }, 0);
                                                        options.isLoading = 0;
                                                    } else {
                                                        options.isLoading = 2;
                                                        $(options.button).html("-- 我已倾囊相授 --");
                                                    }
                                                } else {
                                                    jumi.tips(data.msg);
                                                }
                                            }
                                        });
                                    }
                                }); //end load
                                weixin.setTitle()
                                    .setDesc()
                                    .setImg()
                                    .setUrl()
                                    .share();
                            }
                        }); //vue end
                    } else {
                        jumi.tips(data.msg);
                    }
                }
            });
        }); //isLogin的结束
    });
