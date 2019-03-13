define(['jumi', 'vue', 'getPara', 'weixin'], function(jumi, vue, getPara, weixin) {
    var para = getPara.get();
    var parainit = {
        investBillIdCode: para.param,
        code: para.code,
        requestSource: 'WAP'
    };
    // console.log(parainit);
    $.ajax({
        url: '/weixin/initRedPacketPageDate',
        type: 'post',
        dataType: 'json',
        data: parainit,
        success: function(data) {
            // console.log(data);
            // alert(data.data.returnUrl);
            if (data.code == '0000') {
                if (data.data.returnUrl) {
                    // alert("11");
                    location.href = data.data.returnUrl;
                }else{
                    // alert("22");
                    new vue({
                        el: 'body',
                        components: {
                            'my-redpacket': {
                                template: '#redpacketTemplate',
                                data: function() {
                                    return {
                                        data: data.data,
                                        userphone: '', //输入手机号（初始领取的input）
                                        receiveUserList: data.data.receiveUserList, //红包领取用户列表
                                        recommendPicList: data.data.recommendPicList, //精选内容图片
                                        logoList: data.data.logoList, //顶部推广图片
                                        modifyPhone: '', //待领取手机号（点击修改弹出层中的input）
                                        hasReceive: data.data.hasReceive, //红包是否已领取，true:已领取；false:未领取； 
                                        hasReceiveOver: data.data.hasReceiveOver, //红包是否领完,true:领完；false:未领完；
                                        hasRelatedPhone: data.data.hasRelatedPhone, //当前微信是否关联了领取红包的手机号,false：未关联；true:已关联；
                                        hasRegister: data.data.hasRegister, //判断手机号是否注册 true表示已经注册 、 false表示未注册
                                        updatePhonedialog: false, //是否展示修改手机号的弹出层，false为不展示，true为展示
                                        clickstatus: true, //防止注册按钮二次点击
                                        receiveLogId:data.data.receiveLogId  //后台需要
                                    }
                                },
                                methods: {
                                    toClose: function() {
                                        this.updatePhonedialog = false; //隐藏 弹出层 模块
                                    },
                                    toUpdateDialog: function() { //点击弹出修改密码框
                                        this.updatePhonedialog = true; //显示 弹出层 模块
                                    },
                                    //领取红包
                                    toReceive: function() {
                                        var that = this;
                                        if (that.clickstatus) {

                                            var patrn = /^(13|14|15|16|18|17|19)\d{9}$/;
                                            var bool = patrn.test(that.userphone);
                                            //非空
                                            if (that.userphone == '') {
                                                jumi.tips('请输入手机号码！');
                                                return;
                                            }
                                            //格式错误
                                            if (!bool) {
                                                jumi.tips('手机格式不正确！');
                                                return;
                                            };

                                            that.clickstatus = false;

                                            var parareceive = {
                                                investBillIdCode: para.param,
                                                litpic: that.data.litpic,
                                                nickname: that.data.nickname,
                                                openId: that.data.openId,
                                                phone: that.userphone,
                                                requestSource: 'WAP'
                                            };

                                            // console.log(parareceive);
                                            $.ajax({
                                                url: '/weixin/receiveRedPacket',
                                                type: 'post',
                                                dataType: 'json',
                                                data: parareceive,
                                                success: function(data) {
                                                    // console.log(data);
                                                    if (data.code == '0000') {
                                                        that.hasReceiveOver = data.data.hasReceiveOver;
                                                        that.hasRelatedPhone = data.data.hasRelatedPhone;
                                                        that.hasRegister = data.data.hasRegister;
                                                        that.data.amount = data.data.amount;
                                                        that.data.phone = data.data.phone;
                                                        that.receiveUserList = data.data.receiveUserList; //更新领取红包列表
                                                        that.receiveLogId = data.data.receiveLogId;
                                                        that.hasReceive = data.data.hasReceive;
                                                        if (data.data.hasReceive) { //红包已经领取了
                                                            jumi.tips('您已经领过该红包了~');
                                                        }
                                                    }else{
                                                    	jumi.tips(data.msg);
                                                        that.clickstatus = true;
                                                    }
                                                }
                                            });                                        
                                        }
                                    },
                                    //修改手机
                                    toUpdate: function() {
                                        var that = this;
                                        that.updatePhonedialog = true;
                                        var patrn = /^(13|14|15|16|18|17|19)\d{9}$/;
                                        var bool = patrn.test(that.modifyPhone);
                                        //非空
                                        if (that.modifyPhone == '') {
                                            jumi.tips('请输入手机号码！');
                                            return;
                                        }
                                        //格式错误
                                        if (!bool) {
                                            jumi.tips('手机格式不正确！');
                                            return;
                                        }
                                        var paramodify = {
                                            investBillIdCode: para.param,
                                            modifyPhone: that.modifyPhone, //(新手机号)待领取手机号
                                            openId: that.data.openId, //用于查询修改之前的号码是否兑换
                                            phone: that.data.phone, //已领取的手机号
                                            receiveLogId: that.receiveLogId,
                                            requestSource: 'WAP'
                                        };
                                        // console.log(paramodify);
                                        $.ajax({
                                            url: '/weixin/modifyReceiveRelationship',
                                            type: 'post',
                                            dataType: 'json',
                                            data: paramodify,
                                            success: function(data) {
                                                if (data.code == '0000') {
                                                    that.updatePhonedialog = false; //隐藏 弹出层 模块
                                                    // alert(that.data.hasRegister);
                                                    // 如果修改之前的手机号已经注册过，是不改变手机号码展示以及按钮状态的。反之改变
                                                    if (!that.data.hasRegister) {
                                                        that.hasRegister = data.data.hasRegister;
                                                        that.data.phone = data.data.modifyPhone;
                                                    }
                                                }else{
                                                    jumi.tips(data.msg);
                                                }
                                            }
                                        });
                                    }
                                } //methods结束
                            } //my-redpacket的结束
                        }, //components的结束
                        ready: function() {
                            
                            var that = this;
                            console.log(that.$children[0].data.recommendPicList);
                            $('#myloading').remove();
                            if (that.$children[0].data.hasReceive) { //红包已经领取了
                                jumi.tips('您已经领过该红包了~');
                            }
                            //分享
                            if (localStorage.fromapp == 'ios') {
                                var o = {
                                    title: that.$children[0].data.shareTitle,
                                    desc: that.$children[0].data.shareContent,
                                    img: that.$children[0].data.sharePic,
                                    url: that.$children[0].data.shareUrl
                                }
                                window.webkit.messageHandlers.share.postMessage(o);
                            } else if (localStorage.fromapp == 'android') {
                                var o = {
                                    title: that.$children[0].data.shareTitle,
                                    desc: that.$children[0].data.shareContent,
                                    img: that.$children[0].data.sharePic,
                                    url: that.$children[0].data.shareUrl
                                }
                                window.Android.callAndroidAction('0', JSON.stringify(o));
                            } else {
                                weixin.setTitle(that.$children[0].data.shareTitle)
                                    .setDesc(that.$children[0].data.shareContent)
                                    .setImg(that.$children[0].data.sharePic)
                                    .setUrl(that.$children[0].data.shareUrl)
                                    .share();
                            }
                        }
                    }); //new Vue  的结束                    
                }



            } //code  的结束
        } //success的结束
    });
});