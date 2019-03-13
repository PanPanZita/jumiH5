define(['jumi', 'nav', 'vue', 'getPara', 'isLogin', 'weixin'], function(jumi, nav, vue, getPara, isLogin, weixin) {
    var para = getPara.get();
    var token = localStorage.getItem("token");
    var parainit = {
        investBillId: para.invest_id,
        requestSource: 'WAP',
        token: token
    };
    $.ajax({
        url: '/userCenter/investBill/getRedPacketShareInfo',
        type: 'post',
        dataType: 'json',
        data: parainit,
        success: function(data) {
            // console.log(data);
            if (data.code == '0000') {
                new vue({
                    el: 'body',
                    components: {
                        'my-redpacket': {
                            template: '#redpacketTemplate',
                            data: function() {
                                return {
                                    data: data.data,
                                    isShow: false
                                }
                            },
                            methods: {
                                //发红包
                                show: function() {
                                    this.isShow = true;
                                },
                                //隐藏
                                hide: function() {
                                    this.isShow = false;
                                }
                            }
                        }
                    },
                    ready: function() {
                        nav.setActiveNav("index");
                        $('#myloading').remove();
                        var that = this;
                        // console.log(that);
                        ////分享
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
                });
            }
        }
    });


});