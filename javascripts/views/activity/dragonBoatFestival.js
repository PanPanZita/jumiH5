define(["jumi", "vue", "getPara", "isLogin", "isLoginwx", "weixin"], function(
    jumi,
    vue,
    getPara,
    isLogin,
    isLoginwx,
    weixin
) {
    if (navigator.userAgent.indexOf("Android") != -1) {
        setTimeout(function() {
            fuckingAsshole();
        }, 1000);
    } else {
        fuckingAsshole();
    }
    function fuckingAsshole() {
        var para = getPara.get();
        var scrollEle;
        var phoneRegexr = new RegExp(/^(13|14|15|16|18|17|19)\d{9}$/);
        var token = localStorage.getItem("token");
        var parainit = {
            token: token || null,
            requestSource: "WAP"
        };
        $.ajax({
            type: "get",
            url: "/marketing/isexchange",
            data: parainit,
            success: function(res) {
                var loginStatuz, catchStatuz, orderId, actStatus;
                if (res.code == "0000") {
                    // 已登录未领取
                    loginStatuz = 1;
                    catchStatuz = 0;
                    orderId = null;
                } else if (res.code == "1010") {
                    // 未登录
                    loginStatuz = 0;
                    catchStatuz = 0;
                    orderId = null;
                } else if (res.code == "8019") {
                    // 已登录已领取
                    loginStatuz = 1;
                    catchStatuz = 1;
                    orderId = res.data;
                } else if (res.code == "8015") {
                    actStatus = 5;
                    loginStatuz = 1;
                    catchStatuz = 0;
                    orderId = null;
                } else if (res.code == "8016") {
                    actStatus = 6;
                    loginStatuz = 1;
                    catchStatuz = 0;
                    orderId = null;
                } else if (res.code == "8017") {
                    actStatus = 7;
                    loginStatuz = 1;
                    catchStatuz = 0;
                    orderId = null;
                } else {
                    jumi.tips(res.msg);
                }
                new vue({
                    el: "body",
                    components: {
                        "dragon-boat": {
                            template: "#dragonBoatTemplate",
                            data: function() {
                                return {
                                    loginStatuv: loginStatuz, // 登录状态
                                    catchStatuv: catchStatuz, // 领取状态
                                    addressList: [], // 常用地址列表
                                    orderHref:
                                        "/h5/views/account/active/activeDetail.html?orderId=" +
                                        orderId, // 订单详情地址
                                    addressId: null,
                                    receiveAddress: null, // 收货地址
                                    receiveName: null, // 收货人姓名
                                    receivePhone: null, // 收货人电话
                                    formId: null,
                                    formAddress: "",
                                    formName: "",
                                    formPhone: "",
                                    isChecked: false,
                                    isShelter: false,
                                    info: {
                                        addressId: null, // 非必填
                                        receiveAddress: null, // 收货地址
                                        receiveName: null, // 收货人姓名
                                        receivePhone: null, // 收货人电话
                                        token: token || null,
                                        requestSource: "WAP"
                                    },
                                    shareTitle: "“粽”享端午，浓情来袭",
                                    shareContent:
                                        "在此美好佳节，聚米众筹怎能少得了粽子助兴",
                                    sharePic:
                                        "https://jumifinancetest.oss-cn-hangzhou.aliyuncs.com/itemDetail/1526452426344079104.png",
                                    shareUrl:
                                        location.origin +
                                        "/h5/views/activity/dragonBoatFestival.html"
                                };
                            },
                            methods: {
                                preventDefaultz: function(e) {
                                    e.preventDefault();
                                    return false;
                                },
                                byeShelter: function() {
                                    this.isShelter = false;
                                },
                                catchZz: function() {
                                    if (this.loginStatuv == 0) {
                                        // 未登录
                                        jumi.alert({
                                            skin: "buttonz",
                                            fixed: true,
                                            content: "您还未登录",
                                            button: [
                                                {
                                                    value: "取消"
                                                },
                                                {
                                                    value: "去登录",
                                                    callback: function() {
                                                        // 调用微信登录接口
                                                        isLogin();
                                                    }
                                                }
                                            ]
                                        });
                                    } else if (actStatus == 5) {
                                        // 活动未开始
                                        jumi.alert({
                                            skin: "buttonz",
                                            fixed: true,
                                            content:
                                                "不在活动时间内，不能进行领取！",
                                            button: [
                                                {
                                                    value: "知道了",
                                                    callback: function() {}
                                                }
                                            ]
                                        });
                                    } else if (actStatus == 6) {
                                        // 活动已结束
                                        jumi.alert({
                                            skin: "buttonz",
                                            fixed: true,
                                            content:
                                                "不在活动时间内，不能进行领取！",
                                            button: [
                                                {
                                                    value: "知道了",
                                                    callback: function() {}
                                                }
                                            ]
                                        });
                                    } else if (actStatus == 7) {
                                        // 投资金额不足2万
                                        jumi.alert({
                                            skin: "buttonz",
                                            fixed: true,
                                            content: "您的投资总额未满 2 万元",
                                            button: [
                                                {
                                                    value: "知道了"
                                                },
                                                {
                                                    value: "去投资",
                                                    callback: function() {
                                                        location.href =
                                                            location.origin +
                                                            "/h5/views/main/list.html?type=0&status=0&itemName=";
                                                    }
                                                }
                                            ]
                                        });
                                    } else {
                                        // 已登录未领取，打开遮罩层，填写信息
                                        this.isShelter = true;
                                    }
                                },
                                chooseThis: function(info, e) {
                                    this.isChecked = $(e.target).prop(
                                        "checked"
                                    );
                                    // // 选择一个常用地址，将地址 ID 传上去，将其他地址取消选中，将表单禁用
                                    if (this.isChecked) {
                                        // 当前被选中
                                        $(".switcher input").prop(
                                            "checked",
                                            false
                                        );
                                        $(e.target).prop("checked", true);
                                        $(".universal-item").prop(
                                            "disabled",
                                            true
                                        );
                                        this.addressId = info.id;
                                        this.receiveName = info.userName;
                                        this.receivePhone = info.mobile;
                                        this.receiveAddress =
                                            info.province +
                                            info.city +
                                            info.address;
                                    } else {
                                        // 被释放
                                        $(".switcher input").prop(
                                            "checked",
                                            false
                                        );
                                        $(e.target).prop("checked", false);
                                        $(".universal-item").prop(
                                            "disabled",
                                            false
                                        );
                                    }
                                },
                                getAddressList: function() {
                                    // 获取常用地址列表
                                    var that = this;
                                    $.ajax({
                                        type: "post",
                                        url:
                                            "/userCenter/setting/getUserAddress",
                                        dataType: "json",
                                        data: parainit,
                                        success: function(res) {
                                            if (res.code == "0000") {
                                                // 用户地址列表
                                                that.addressList =
                                                    res.data.addressList;
                                            } else {
                                                jumi.tips(res.msg);
                                            }
                                        },
                                        error: function(error) {
                                            console.error(error);
                                        }
                                    });
                                },
                                submitInfo: function() {
                                    // 判断是否使用常用地址，如果是需要正则验证
                                    if (this.isChecked) {
                                        this.info.addressId = this.addressId;
                                        this.info.receiveName = this.receiveName;
                                        this.info.receivePhone = this.receivePhone;
                                        this.info.receiveAddress = this.receiveAddress;
                                        // 提交信息
                                        this.uploadInfo();
                                    } else {
                                        this.info.addressId = this.formId;
                                        this.info.receiveName = this.formName;
                                        this.info.receivePhone = this.formPhone;
                                        this.info.receiveAddress = this.formAddress;
                                        // 正则验证
                                        if (
                                            !this.info.receiveName ||
                                            this.info.receiveName.trim()
                                                .length == 0
                                        ) {
                                            jumi.tips("收货人姓名不能为空");
                                            return;
                                        }
                                        if (
                                            !phoneRegexr.test(
                                                this.info.receivePhone
                                            )
                                        ) {
                                            jumi.tips("收货人手机号格式不正确");
                                            return;
                                        }
                                        if (
                                            !this.info.receiveAddress ||
                                            this.info.receiveAddress.trim()
                                                .length == 0
                                        ) {
                                            jumi.tips("收货地址不能为空");
                                            return;
                                        }
                                        this.uploadInfo();
                                    }
                                },
                                uploadInfo: function() {
                                    var that = this;
                                    // 领取提交个人信息
                                    $.ajax({
                                        type: "post",
                                        url: "/marketing/saveorder",
                                        dataType: "json",
                                        data: that.info,
                                        success: function(res) {
                                            console.log(res);
                                            if (res.code == "0000") {
                                                that.isShelter = false;
                                                // 提交成功
                                                setTimeout(function() {
                                                    that.orderId = res.data;
                                                    orderHref: jumi.alert({
                                                        skin: "buttonz",
                                                        fixed: true,
                                                        content:
                                                            "领取成功，奖励将会在 3 个工作日内发放",
                                                        button: [
                                                            {
                                                                value: "知道了",
                                                                callback: function() {
                                                                    that.loginStatuv = 1;
                                                                    that.catchStatuv = 1;
                                                                }
                                                            },
                                                            {
                                                                value:
                                                                    "查看订单",
                                                                callback: function() {
                                                                    var totalUrl =
                                                                        location.origin +
                                                                        "/h5/views/account/active/activeDetail.html?orderId=" +
                                                                        res.data;
                                                                    location.replace(
                                                                        totalUrl
                                                                    );
                                                                }
                                                            }
                                                        ]
                                                    });
                                                }, 500);
                                            } else {
                                                jumi.tips(res.msg);
                                            }
                                        },
                                        error: function(error) {
                                            console.error(error);
                                        }
                                    });
                                }
                            }, //methods的结束
                            watch: {
                                isShelter: function() {
                                    if (this.isShelter) {
                                        scrollEle.style.overflow = "hidden";
                                    } else {
                                        scrollEle.style.overflow = "initial";
                                    }
                                }
                            }
                        } //dragon-boat的结束
                    }, //components的结束
                    ready: function() {
                        $("#myloading").remove();
                        if (para.from) {
                            // 微信登陆--该链接后面带参数
                            var url = location.href.split("&code=")[0];
                            var locationCodepar = location.href.split(
                                "&code="
                            )[1];
                            if (locationCodepar) {
                                var locationCode = locationCodepar.split(
                                    "&state="
                                )[0];
                                isLoginwx(locationCode, url);
                            }
                        } else {
                            var url = location.href.split("?code=")[0];
                            var locationCodepar = location.href.split(
                                "?code="
                            )[1];
                            if (locationCodepar) {
                                var locationCode = locationCodepar.split(
                                    "&state="
                                )[0];
                                isLoginwx(locationCode, url);
                            }
                        }
                        var that = this;
                        // 获取用户地址列表
                        if (loginStatuz == 1 && catchStatuz == 0) {
                            //  已登录未领取，获取用户常用地址列表
                            that.$children[0].getAddressList();
                        }
                        scrollEle = document.getElementById("dragonBoat");
                        if (localStorage.fromapp == "ios") {
                            var o = {
                                title: that.$children[0].shareTitle,
                                desc: that.$children[0].shareContent,
                                img: that.$children[0].sharePic,
                                url: that.$children[0].shareUrl
                            };
                            window.webkit.messageHandlers.share.postMessage(o);
                        } else if (localStorage.fromapp == "android") {
                            var o = {
                                title: that.$children[0].shareTitle,
                                desc: that.$children[0].shareContent,
                                img: that.$children[0].sharePic,
                                url: that.$children[0].shareUrl
                            };
                            window.Android.callAndroidAction(
                                "0",
                                JSON.stringify(o)
                            );
                        }
                        weixin
                            .setTitle(that.$children[0].shareTitle)
                            .setDesc(that.$children[0].shareContent)
                            .setImg(that.$children[0].sharePic)
                            .setUrl(that.$children[0].shareUrl)
                            .share();
                    }
                }); //new Vue的结束
            },
            error: function(error) {
                console.error(error);
            }
        });
    }
});
