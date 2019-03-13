define([
    "jumi",
    "limit",
    "isLogin",
    "isLoginwx",
    "vue",
    "getPara",
    "scrolltotop",
    "weixin",
    "load"
], function (
    jumi,
    limit,
    isLogin,
    isLoginwx,
    vue,
    getPara,
    scrolltotop,
    weixin,
    load
) {
        var para = getPara.get();
        var itemId = para.itemid;
        var commentType = para.commentType.split("#")[0];
        var token = localStorage.getItem("token"); //为了验证用户是否登录
        var paraload = {};
        paraload.currentPage = 1;
        paraload.pageSize = 10;
        var parainit = {
            currentPage: 1,
            commentType: commentType,
            pageSize: 9999,
            itemId: itemId,
            requestSource: "WAP",
            token: token
        };
        $.ajax({
            url: "/comment/list/v1.0",
            type: "get",
            data: parainit,
            success: function (data) {
                var lists = data.data.commentList;
                var markz = location.href.split("#")[1] ? location.href.split("#")[1].split("d")[1] : false;
                for (var i = 0, lls = lists.length; i < lls; i++) {
                    (function (i) {
                        var parking = lists[i].subCommentList.concat();
                        if (parking && parking.length > 2) {
                            for (var m = 0; m < parking.length; m++) {
                                if (markz == lists[i].subCommentList[m].id) {
                                    lists[i].isExpand = true;
                                } else {
                                    lists[i].isExpand = false;
                                }
                            }
                        }
                        lists[i].subSplice = parking.splice(0, 2);
                    })(i)
                }
                new vue({
                    el: "body",
                    components: {
                        "my-comment": {
                            template: "#commentTemplate",
                            data: function () {
                                return {
                                    userid: data.data.userId, //账户拥有者，去评论别人的人的id。
                                    lists: lists,
                                    isLoading: 0, //0加载更多，1正在加载，2无更多记录
                                    msg: "", //回复主题textarea
                                    subMsg: "", //回复个人textarea\
                                    maoz: location.href.split("#")[1] ? location.href.split("#")[1].split("d")[1] : "",
                                    ctz: commentType,
                                    sendSwitch: true
                                };
                            },
                            methods: {
                                expandAll: function (toggle) {
                                    toggle.isExpand = true;
                                },
                                foldAll: function (toggle) {
                                    toggle.isExpand = false;
                                },
                                watchProgram: function () {
                                    switch (commentType) {
                                        case "3":
                                            // 项目详情
                                            location.assign("/h5/views/invest/invest.html?itemId=" + itemId);
                                            break;
                                        case "2":
                                            // 新闻报道
                                            location.assign("/h5/views/notice/mediaReport.html?inforId=" + itemId);
                                            break;
                                        case "1":
                                            // 项目动态
                                            location.assign("/h5/views/notice/projectDynamics.html?inforId=" + itemId);
                                            break;
                                        case "0":
                                            // 平台公告
                                            location.assign("/h5/views/notice/announcement.html?inforId=" + itemId);
                                            break;
                                        default:
                                            break;
                                    }
                                },
                                toLogin: function () {
                                    isLogin();
                                },
                                //回复主题(点击发送按钮)
                                sendMsg: function () {
                                    var that = this;
                                    isLogin(function () {
                                        var paratopic = {
                                            commentType: commentType,
                                            content: that.msg.replace(/<[^>]*>/g, ""),
                                            itemId: itemId,
                                            parentCommentId: 0,
                                            parentId: 0, //表示对项目或者商品进行评论
                                            requestSource: "WAP",
                                            token: token
                                        };
                                        if (that.msg == "") {
                                            jumi.tips("评论不能为空！");
                                            return;
                                        }
                                        if (that.sendSwitch) {
                                            that.sendSwitch = false;
                                            $.ajax({
                                                url: "/comment/reply/v1.0",
                                                type: "get",
                                                data: {
                                                    id: 0,
                                                    requestSource: "WAP",
                                                    token: token
                                                },
                                                success: function (data) {
                                                    if (data.code == "0000") {
                                                        $.ajax({
                                                            url: "/comment/comment/v1.0",
                                                            type: "post",
                                                            dataType: "json",
                                                            data: paratopic,
                                                            success: function (data) {
                                                                if (data.code == "0000") {
                                                                    if (data.data) {
                                                                        var newCs = data.data;
                                                                        newCs.isExpand = false;
                                                                        if (newCs.subCommentList) {
                                                                            newCs.subSplice = newCs.subCommentList.concat().splice(0, 2);
                                                                        }
                                                                        jumi.tips('评论成功！');
                                                                        that.msg = "";
                                                                        $("[data-limitnumber]").html(150);
                                                                        that.obj = that.lists;
                                                                        that.obj.unshift(newCs); //将最新评论展示在最上边
                                                                        that.lists = that.obj;
                                                                        $(window).scrollTop(0);
                                                                        that.sendSwitch = true;
                                                                    }
                                                                } else {
                                                                    jumi.tips(data.msg);
                                                                    setTimeout(function () {
                                                                        location.reload();
                                                                    }, 3000);
                                                                }
                                                            }
                                                        });
                                                    } else if (data.code == "8024") {
                                                        jumi.tips("您的行为存在不安全隐患，已被禁言处理，如需恢复请与客服联系");
                                                        setTimeout(function () {
                                                            location.reload();
                                                        }, 3000);
                                                    } else if (data.code == "8025") {
                                                        jumi.tips("该评论不存在");
                                                        setTimeout(function () {
                                                            location.reload();
                                                        }, 3000);
                                                    } else {
                                                        jumi.tips(data.msg);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                },
                                //回复主评论
                                replyMain: function (touserid, id) {
                                    //初始化的评论者userId在这里作为这里其他用户的被评论人的主键id；初始化的该条评论id作为这里其他用户评论的父类评论id。【重在理解角色转换！！！】
                                    var that = this;
                                    limit({
                                        dom: "#replyMsg",
                                        numDom: null,
                                        max: 150
                                    });
                                    isLogin(function () {
                                        $.ajax({
                                            url: "/comment/reply/v1.0",
                                            type: "get",
                                            data: {
                                                id: id,
                                                requestSource: "WAP",
                                                token: token
                                            },
                                            success: function (data) {
                                                if (data.code == "0000") {
                                                    jumi.alert({
                                                        content: document.getElementById("replyMsg"),
                                                        skin: "ui-dialog-reply",
                                                        button: [
                                                            {
                                                                value: "取消"
                                                            },
                                                            {
                                                                value: "发送",
                                                                callback: function () {
                                                                    if (that.subMsg == "") {
                                                                        jumi.tips("不能为空！");
                                                                        return false;
                                                                    }
                                                                    var paraperson = {
                                                                        commentType: commentType,
                                                                        content: that.subMsg.replace(/<[^>]*>/g, ""),
                                                                        itemId: itemId,
                                                                        parentCommentId: id,
                                                                        // parentId: 0,
                                                                        parentId: id,
                                                                        requestSource: "WAP",
                                                                        toUserId: touserid,
                                                                        token: token
                                                                    };
                                                                    $.ajax({
                                                                        url: "/comment/comment/v1.0",
                                                                        type: "post",
                                                                        dataType: "json",
                                                                        data: paraperson,
                                                                        success: function (data) {
                                                                            if (data.code == "0000") {
                                                                                that.obj = that.lists;
                                                                                for (var i = 0; i < that.obj.length; i++) {
                                                                                    if (id == that.obj[i].id) {
                                                                                        that.obj[i].isExpand = true;
                                                                                        //判断该条（回复个人）的该评论的parentid 是否和该条被评论id相同。相同的话就加在对应的该评论下边
                                                                                        that.obj[i].subCommentList.push(data.data);
                                                                                        that.obj[i].subSplice = that.obj[i].subCommentList.concat().splice(0, 2);
                                                                                    }
                                                                                }
                                                                                that.subMsg = "";
                                                                                that.lists = that.obj; //表示新生成的评论的总列表清单。一般是10条
                                                                            } else {
                                                                                jumi.tips(data.msg);
                                                                                setTimeout(function () {
                                                                                    location.reload();
                                                                                }, 3000);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        ]
                                                    });
                                                } else if (data.code == "8024") {
                                                    jumi.tips("您的行为存在不安全隐患，已被禁言处理，如需恢复请与客服联系");
                                                    setTimeout(function () {
                                                        location.reload();
                                                    }, 3000);
                                                } else if (data.code == "8025") {
                                                    jumi.tips("该评论不存在");
                                                    setTimeout(function () {
                                                        location.reload();
                                                    }, 3000);
                                                } else {
                                                    jumi.tips(data.msg);
                                                }
                                            }
                                        });
                                    });
                                },
                                //回复副评论
                                replySub: function (touserid, id, parentid) {
                                    console.log("replySub");
                                    //初始化的评论者userId在这里作为这里其他用户的被评论人的主键id；初始化的该条评论id作为这里其他用户评论的父类评论id。【重在理解角色转换！！！】
                                    var that = this;
                                    limit({
                                        dom: "#replyMsg",
                                        numDom: null,
                                        max: 150
                                    });
                                    isLogin(function () {
                                        $.ajax({
                                            url: "/comment/reply/v1.0",
                                            type: "get",
                                            data: {
                                                id: id,
                                                requestSource: "WAP",
                                                token: token
                                            },
                                            success: function (data) {
                                                if (data.code == "0000") {
                                                    jumi.alert({
                                                        content: document.getElementById("replyMsg"),
                                                        skin: "ui-dialog-reply",
                                                        button: [
                                                            {
                                                                value: "取消"
                                                            },
                                                            {
                                                                value: "发送",
                                                                callback: function () {
                                                                    if (that.subMsg == "") {
                                                                        jumi.tips("不能为空！");
                                                                        return false;
                                                                    }
                                                                    var paraperson = {
                                                                        commentType: commentType,
                                                                        content: that.subMsg.replace(/<[^>]*>/g, ""),
                                                                        itemId: itemId,
                                                                        parentCommentId: id,
                                                                        parentId: parentid, //表示对评论进行评论
                                                                        requestSource: "WAP",
                                                                        toUserId: touserid,
                                                                        token: token
                                                                    };
                                                                    $.ajax({
                                                                        url: "/comment/comment/v1.0",
                                                                        type: "post",
                                                                        dataType: "json",
                                                                        data: paraperson,
                                                                        success: function (data) {
                                                                            if (data.code == "0000") {
                                                                                that.obj = that.lists;
                                                                                for (var i = 0; i < that.obj.length; i++) {
                                                                                    if (parentid == that.obj[i].id) {
                                                                                        that.obj[i].isExpand = true;
                                                                                        //判断该条（回复个人）的该评论的parentid 是否和该条被评论id相同。相同的话就加在对应的该评论下边
                                                                                        that.obj[i].subCommentList.push(data.data);
                                                                                        that.obj[i].subSplice = that.obj[i].subCommentList.concat().splice(0, 2);
                                                                                    }
                                                                                }
                                                                                that.subMsg = "";
                                                                                that.lists = that.obj; //表示新生成的评论的总列表清单。一般是10条
                                                                            } else {
                                                                                jumi.tips(data.msg);
                                                                                setTimeout(function () {
                                                                                    location.reload();
                                                                                }, 3000);
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        ]
                                                    });
                                                } else if (data.code == "8024") {
                                                    jumi.tips("您的行为存在不安全隐患，已被禁言处理，如需恢复请与客服联系");
                                                    setTimeout(function () {
                                                        location.reload();
                                                    }, 3000);
                                                } else if (data.code == "8025") {
                                                    jumi.tips("该评论不存在");
                                                    setTimeout(function () {
                                                        location.reload();
                                                    }, 3000);
                                                } else {
                                                    jumi.tips(data.msg);
                                                }
                                            }
                                        });
                                    });
                                },
                                //删除评论
                                del: function (id) {
                                    var that = this;
                                    isLogin(function () {
                                        jumi.alert({
                                            content: "是否确认删除？",
                                            button: [
                                                {
                                                    value: "取消"
                                                },
                                                {
                                                    value: "确认",
                                                    callback: function () {
                                                        $.ajax({
                                                            url: "/comment/comment/v1.0",
                                                            type: "post",
                                                            // dataType: "json",
                                                            data: {
                                                                commentId: id,
                                                                requestSource: "WAP",
                                                                token: token,
                                                                _method: 'delete'
                                                            },
                                                            success: function (data) {
                                                                if (data.code == "0000") {
                                                                    jumi.tips("删除成功！");
                                                                    for (var i = 0; i < that.lists.length; i++) {
                                                                        if (id == that.lists[i].id) {
                                                                            that.lists.splice(i, 1);
                                                                        }
                                                                    }
                                                                } else {
                                                                    jumi.tips(data.msg);
                                                                    setTimeout(function () {
                                                                        location.reload();
                                                                    }, 3000);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        });
                                    });
                                },
                                //删除子评论
                                subDel: function (id) {
                                    var that = this;
                                    isLogin(function () {
                                        jumi.alert({
                                            content: "是否确认删除？",
                                            button: [
                                                {
                                                    value: "取消"
                                                },
                                                {
                                                    value: "确认",
                                                    callback: function () {
                                                        $.ajax({
                                                            url: "/comment/comment/v1.0",
                                                            type: "post",
                                                            // dataType: "json",
                                                            data: {
                                                                commentId: id,
                                                                requestSource: "WAP",
                                                                token: token,
                                                                _method: 'delete'
                                                            },
                                                            success: function (data) {
                                                                if (data.code == "0000") {
                                                                    jumi.tips("删除成功！");
                                                                    // for (var i = 0; i < that.lists.length; i++) {
                                                                    //     for (var j = 0; j < that.lists[i].subCommentList.length; j++) {
                                                                    //         if (id == that.lists[i].subCommentList[j].id) {
                                                                    //             that.lists[i].subCommentList.splice(j, 1);
                                                                    //         }
                                                                    //     }
                                                                    // }
                                                                    setTimeout(function () {
                                                                        location.reload();
                                                                    }, 2400);
                                                                } else {
                                                                    jumi.tips(data.msg);
                                                                    setTimeout(function () {
                                                                        location.reload();
                                                                    }, 3000);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        });
                                    });
                                }
                            }
                        }
                    },
                    ready: function () {
                        var hashz = para.commentType.split("#")[1];
                        if (hashz) {
                            window.location.hash = "#" + hashz;
                            window.location = window.location;
                        }
                        //微信登陆--该链接后面带参数
                        var url = location.href.split("&code=")[0];
                        var locationCodepar = location.href.split("&code=")[1];
                        if (locationCodepar) {
                            var locationCode = locationCodepar.split("&state=")[0];
                            isLoginwx(locationCode, url);
                        }
                        var that = this;
                        $("#myloading").remove();
                        setTimeout(function () {
                            window.scrollBy(0, -140);
                        }, 300);
                        //字数限制
                        limit({
                            dom: "[data-msg]",
                            numDom: "[data-limitnumber]",
                            max: 150
                        });
                        //评论获取焦点时增加高度
                        $(function () {
                            $("[data-msg]").on({
                                focusin: function () {
                                    $(this).animate(
                                        {
                                            height: "13rem"
                                        },
                                        200,
                                        function () {
                                            $(this).css({
                                                overflow: "scroll"
                                            });
                                        }
                                    );
                                },
                                focusout: function () {
                                    $(this).animate(
                                        {
                                            height: "4.2rem"
                                        },
                                        200,
                                        function () {
                                            $(this).css({
                                                overflow: "scroll"
                                            });
                                        }
                                    );
                                }
                            });
                        });

                        //分享
                        weixin
                            .setTitle()
                            .setDesc()
                            .setImg()
                            .setUrl()
                            .share();
                    }
                });
            }
        });
    });
