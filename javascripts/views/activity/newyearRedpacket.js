define(['jumi', 'vue', 'getPara', 'weixin'], function (jumi, vue, getPara, weixin) {
    var para = getPara.get();
    var parainit = {
        code: para.code,
        ruleId: para.id,
        requestSource: 'WAP'
    };
    //获取微信用户红包领取结果和用户微信信息
    $.ajax({
        url: '/activityHongbao/getReceiveResult',
        type: 'get',
        dataType: 'json',
        data: parainit,
        success: function (data) {
            console.log("getReceiveResult");
            console.log(data);
            if (data.code == '0000') {
                if (data.data.revResult.hasRedirect == 1) {
                    location.href = data.data.revResult.redirectUrl;
                } else {
                    new vue({
                        el: 'body',
                        components: {
                            'my-redpacket': {
                                template: '#redpacketTemplate',
                                data: function () {
                                    return {
                                        data: data.data,
                                        //是否重定向
                                        isRedirect: data.data.revResult.hasRedirect,
                                        //重定向地址
                                        redirectURL: data.data.revResult.redirectUrl,
                                        //用户手机号
                                        userPhone: data.data.revResult.phone,
                                        //红包总金额、顶部图片地址、总数量、标题
                                        redpacketAmt: data.data.hbAmt,
                                        redpacketImg: data.data.hbImgUrl,
                                        redpacketNum: data.data.hbNumber,
                                        redpacketTitle: data.data.hbTitle,
                                        //红包领取记录
                                        receiveUserList: data.data.revResult.revUserInfoList,
                                        //顶部用户头像
                                        userHead: data.data.revResult.userHeadImgUrl,
                                        /*
                                        领取结果
                                            nickName        用户微信昵称 ---> 前端没用，要传给后台
                                            openId          用户微信openId ---> 前端没用，要传给后台
                                            revAmt          领取金额
                                            revStatus       领取状态 ---> 前端没用，要传给后台
                                            revTime         领取时间 ---> 前端没用，要传给后台
                                        */
                                        result: data.data.revResult,
                                        //领取金额
                                        saveMoney: data.data.revResult.revAmt,
                                        //是否已领取 ---> 0:未领取; 1:已领取; 2:已领取完; 3:聚米账户余额不足
                                        hasReceive: data.data.revResult.revStatus,
                                        //是否注册 ---> 0:未注册; 1:已注册
                                        hasRegister: data.data.revResult.hasRegister,
                                        //防止注册按钮二次点击
                                        clickstatus: true,
                                        //默认红包没有打开, 和遮罩层有关系
                                        opening: false,
                                        //用户ID
                                        shareUserId: data.data.revResult.shareUserId,
                                        //分享相关
                                        shareTitle: data.data.shareInfo.shareTitle,
                                        shareContent: data.data.shareInfo.shareContent,
                                        sharePic: data.data.shareInfo.shareImageUrl,
                                        shareUrl: data.data.shareInfo.shareLinkUrl
                                    };
                                },
                                computed: {
                                    sumRedpacket: function () {
                                        var that = this;
                                        var sum = 0;
                                        for (var i = 0; i < that.receiveUserList.length; i++) {
                                            sum = sum + that.receiveUserList[i].revAmt;
                                        };
                                        return sum;
                                    }
                                },
                                methods: {
                                    replaceUse: function () {
                                        location.replace("/h5/views/main/index.html");
                                    },
                                    replaceReg: function () {
                                        // location.replace("/h5/views/common/register.html");
                                        location.replace("/h5/views/account/invite/inviteFriend.html?u=" + this.shareUserId);
                                    },
                                    //打开红包遮罩层，获取红包主页数据
                                    openRedpacket: function () {
                                        var that = this;
                                        var openPara = {
                                            nickName: that.result.nickName,
                                            openId: that.result.openId,
                                            userHeadImgUrl: that.userHead,
                                            ruleId: para.id,
                                        };
                                        $.ajax({
                                            url: '/activityHongbao/getHomePageData',
                                            type: 'get',
                                            dataType: 'json',
                                            data: openPara,
                                            success: function (dataOpen) {
                                                console.log("getHomePageData");
                                                console.log(dataOpen);
                                                if (dataOpen.code == "0000") {
                                                    that.shareUserId = dataOpen.data.revResult.shareUserId;
                                                    that.userPhone = dataOpen.data.revResult.phone;
                                                    that.redpacketAmt = dataOpen.data.hbAmt; //总金额
                                                    that.redpacketNum = dataOpen.data.hbNumber; //总数量
                                                    that.receiveUserList = dataOpen.data.revResult.revUserInfoList; //领取记录
                                                    that.saveMoney = dataOpen.data.revResult.revAmt; //用户领取金额
                                                    that.hasReceive = dataOpen.data.revResult.revStatus; //是否已领取 ---> 0:未领取; 1:已领取; 2:已领取完; 3:聚米账户余额不足
                                                    that.hasRegister = dataOpen.data.revResult.hasRegister; //是否注册 ---> 0:未注册; 1:已注册
                                                    $("#redCover").animate({ opacity: 0 }, 300, function () {
                                                        that.opening = true; //打开红包
                                                    });
                                                } else {
                                                    jumi.tips(dataOpen.msg, 3000);
                                                };
                                            }
                                        });
                                    },
                                    //手动点击领取
                                    toReceive: function () {
                                        var that = this;
                                        if (that.clickstatus) {
                                            that.clickstatus = false;
                                            var patrn = /^(13|14|15|16|18|17|19)\d{9}$/;
                                            var bool = patrn.test(that.userPhone);
                                            //手机非空
                                            if (that.userPhone == '') {
                                                jumi.tips('请输入手机号码！');
                                                return;
                                            };
                                            //格式错误
                                            if (!bool) {
                                                jumi.tips('手机格式不正确！');
                                                return;
                                            };
                                            var parareceive = {
                                                nickName: that.result.nickName,
                                                openId: that.result.openId,
                                                phone: that.userPhone,
                                                userHeadImgUrl: that.userHead,
                                                ruleId: para.id,
                                            };
                                            jumi.alert({
                                                content: "确认关联手机号" + parareceive.phone + "吗？",
                                                width: "90%",
                                                height: "auto",
                                                skin: 'jumiaz',
                                                button: [{
                                                    value: "取消",
                                                    callback: function () {
                                                        that.clickstatus = true;
                                                    }
                                                }, {
                                                    value: "确定",
                                                    callback: function () {
                                                        that.clickstatus = false;
                                                        $.ajax({
                                                            url: '/activityHongbao/handReceiveHongbao',
                                                            type: 'get',
                                                            dataType: 'json',
                                                            data: parareceive,
                                                            success: function (dataManual) {
                                                                that.clickstatus = true;
                                                                console.log("handReceiveHongbao");
                                                                console.log(dataManual);
                                                                if (dataManual.code == '0000') {
                                                                    that.shareUserId = dataManual.data.shareUserId;
                                                                    that.userPhone = dataManual.data.phone;
                                                                    that.result.openId = dataManual.data.openId;
                                                                    that.hasReceive = dataManual.data.revStatus;
                                                                    that.hasRegister = dataManual.data.hasRegister;
                                                                    that.userPhone = dataManual.data.phone;
                                                                    that.saveMoney = dataManual.data.revAmt;
                                                                    if (that.hasReceive == 1) {
                                                                        that.receiveUserList.push({
                                                                            userHeadImgUrl: dataManual.data.userHeadImgUrl,
                                                                            nickName: dataManual.data.nickName,
                                                                            revTime: dataManual.data.revTime,
                                                                            revAmt: dataManual.data.revAmt
                                                                        }); //更新领取红包列表
                                                                    };
                                                                } else {
                                                                    // jumi.tips(dataManual.msg, 3000);
                                                                    jumi.alert({
                                                                        content: dataManual.msg,
                                                                        width: "90%",
                                                                        height: "auto",
                                                                        skin: 'jumiaz',
                                                                        button: [{
                                                                            value: "确定",
                                                                            callback: function () {
                                                                                $.noop;
                                                                            }
                                                                        }]
                                                                    });
                                                                };
                                                            }
                                                        });
                                                    }
                                                }]
                                            });
                                        };
                                    }
                                } //methods的结束
                            } //my-redpacket的结束
                        }, //components的结束
                        ready: function () {
                            var that = this;
                            $('#myloading').remove();
                            //遮罩判断
                            if (that.$children[0].hasReceive == 0) {
                                $("title").text("聚米新年红包");
                            } else {
                                $("title").text("红包详情");
                            };
                            if (that.$children[0].hasReceive == 1) {
                                that.$children[0].opening = true;
                                jumi.tips('您已经领过该红包了！');
                            };
                            //分享
                            if (localStorage.fromapp == 'ios') {
                                var o = {
                                    title: that.$children[0].data.shareTitle,
                                    desc: that.$children[0].data.shareContent,
                                    img: that.$children[0].data.sharePic,
                                    url: that.$children[0].data.shareUrl
                                };
                                window.webkit.messageHandlers.share.postMessage(o);
                            } else if (localStorage.fromapp == 'android') {
                                var o = {
                                    title: that.$children[0].data.shareTitle,
                                    desc: that.$children[0].data.shareContent,
                                    img: that.$children[0].data.sharePic,
                                    url: that.$children[0].data.shareUrl
                                };
                                window.Android.callAndroidAction('0', JSON.stringify(o));
                            } else {
                                weixin.setTitle(that.$children[0].shareTitle)
                                    .setDesc(that.$children[0].shareContent)
                                    .setImg(that.$children[0].sharePic)
                                    .setUrl(that.$children[0].shareUrl)
                                    .share();
                            };
                        }
                    }); //new Vue的结束  
                };
            } else {
                jumi.tips(data.msg, 3000);
            }; //code的结束
        } //success的结束
    });
});