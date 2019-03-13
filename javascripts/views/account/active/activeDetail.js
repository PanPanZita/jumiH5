define([
    "jumi",
    "tab",
    "vue",
    "isLogin",
    "isLoginwx",
    "getPara",
    "weixin"
], function(jumi, tab, vue, isLogin, isLoginwx, getPara, weixin) {
    var para = getPara.get();
    var token = localStorage.getItem("token");
    var addressId = !para.address_id ? 0 : para.address_id;
    var parainit = {
        token: token,
        orderId: para.orderId,
        requestSource: "WAP",
        addressId: addressId // 刚开始没有地址的时候就传参数0，否则传真正的addressId
    };
    // console.log(parainit);
    isLogin(function() {
        $.ajax({
            url: "/userCenter/personalCenter/orderinfo",
            type: "get",
            data: parainit,
            success: function(data) {
                // console.log(data);
                if (data.code == "0000") {
                    new vue({
                        el: "body",
                        components: {
                            "my-active": {
                                template: "#activeTemplate",
                                data: function() {
                                    return {
                                        data: data.data,
                                        remark: data.data.remark, // 备注
                                        isIOSShow:
                                            localStorage.fromapp == "ios" // 为 iOS 通过官方审核而用
                                    };
                                },
                                filters: {
                                    timeFilter: function(timeStampz) {
                                        var time = new Date(timeStampz);
                                        var y = time.getFullYear();
                                        var m = time.getMonth() + 1;
                                        m = m < 10 ? "0" + m : m;
                                        var d = time.getDate();
                                        d = d < 10 ? "0" + d : d;
                                        var h = time.getHours();
                                        h = h < 10 ? "0" + h : h;
                                        var min = time.getMinutes();
                                        min = min < 10 ? "0" + min : min;
                                        var sec = time.getSeconds();
                                        sec = sec < 10 ? "0" + sec : sec;
                                        return (
                                            y +
                                            "-" +
                                            m +
                                            "-" +
                                            d +
                                            " " +
                                            h +
                                            ":" +
                                            min +
                                            ":" +
                                            sec
                                        );
                                    }
                                },
                                methods: {
                                    // 确认订单
                                    ok: function() {
                                        var that = this;
                                        if (that.data.orderType == 1) {
                                            //寄送订单
                                            if (!that.data.addressId) {
                                                jumi.tips("请完善收货地址");
                                                return;
                                            }
                                        }
                                        var thataddressId = that.data.addressId
                                            ? that.data.addressId
                                            : 0;
                                        var paraconfirm = {
                                            addressId: thataddressId,
                                            orderId: para.orderId,
                                            remark: that.remark,
                                            requestSource: "WAP",
                                            token: token
                                        };
                                        // console.log(paraconfirm);
                                        jumi.alert({
                                            skin: "ui-dialog-bankcard",
                                            content:
                                                "聚小米提醒您，是否确认订单？",
                                            button: [
                                                {
                                                    value: "取消"
                                                },
                                                {
                                                    value: "确认订单",
                                                    callback: function() {
                                                        $.ajax({
                                                            url:
                                                                "/userCenter/personalCenter/checkOrder",
                                                            type: "post",
                                                            dataType: "json",
                                                            data: paraconfirm,
                                                            success: function(
                                                                data
                                                            ) {
                                                                // console.log(data);
                                                                if (
                                                                    data.code ==
                                                                    "0000"
                                                                ) {
                                                                    location.reload();
                                                                } else {
                                                                    jumi.tips(
                                                                        data.msg
                                                                    );
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        });
                                    },
                                    //确认收货
                                    receive: function() {
                                        var parareceive = {
                                            orderId: para.orderId,
                                            requestSource: "WAP",
                                            token: token
                                        };
                                        jumi.alert({
                                            skin: "ui-dialog-bankcard",
                                            content:
                                                "聚小米提醒您，是否确认收货？",
                                            button: [
                                                {
                                                    value: "取消"
                                                },
                                                {
                                                    value: "确认收货",
                                                    callback: function() {
                                                        $.ajax({
                                                            url:
                                                                "/userCenter/personalCenter/checkOrderStatus",
                                                            type: "post",
                                                            dataType: "json",
                                                            data: parareceive,
                                                            success: function(
                                                                data
                                                            ) {
                                                                // console.log(data);
                                                                if (
                                                                    data.code ==
                                                                    "0000"
                                                                ) {
                                                                    location.reload();
                                                                } else {
                                                                    jumi.tips(
                                                                        data.msg
                                                                    );
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        });
                                    },
                                    // 删除订单
                                    deleteOrder: function() {
                                        var parareceive = {
                                            orderId: para.orderId,
                                            requestSource: "WAP",
                                            token: token
                                        };
                                        jumi.alert({
                                            skin: "ui-dialog-bankcard",
                                            content:
                                                "聚小米提醒您，是否删除订单？",
                                            button: [
                                                {
                                                    value: "取消"
                                                },
                                                {
                                                    value: "删除",
                                                    callback: function() {
                                                        $.ajax({
                                                            url:
                                                                "/userCenter/personalCenter/deleteorder",
                                                            type: "post",
                                                            dataType: "json",
                                                            data: parareceive,
                                                            success: function(
                                                                data
                                                            ) {
                                                                // console.log(data);
                                                                if (
                                                                    data.code ==
                                                                    "0000"
                                                                ) {
                                                                    location.replace(
                                                                        "/h5/views/account/active/activeRecord.html"
                                                                    );
                                                                } else {
                                                                    jumi.tips(
                                                                        data.msg
                                                                    );
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        });
                                    }
                                }
                            }
                        },
                        ready: function() {
                            var that = this;
                            $("#myloading").remove();
                            if (that.$children[0].data.orderStatus == 1) {
                                $("#remarkDom").prop("disabled", false);
                            } else {
                                $("#remarkDom").prop("disabled", true);
                            }
                            // 分享
                            weixin
                                .setTitle()
                                .setDesc()
                                .setImg()
                                .setUrl()
                                .share();
                        }
                    });
                } else {
                    jumi.tips(data.msg);
                }
            },
            error: function(error) {
                console.error(error);
            }
        });
    }); // isLogin的结束

    // 微信登陆--该链接后面不带参数
    var url = location.href.split("?code=")[0];
    var locationCodepar = location.href.split("?code=")[1];
    if (locationCodepar) {
        var locationCode = locationCodepar.split("&state=")[0];
        isLoginwx(locationCode, url);
    }
});
