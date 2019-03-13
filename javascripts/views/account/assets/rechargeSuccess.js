define(['jumi', 'nav', 'vue', 'isLogin', 'getPara', 'weixin'], function(jumi, nav, vue, isLogin, getPara, weixin) {
    var para = getPara.get();
    isLogin(function() {
        new vue({
            el: 'body',
            components: {
                'my-recharge': {
                    template: '#rechargeTemplate',
                    data: function() {
                        return {}
                    },
                    methods: {
                        backindex: function() {
                            location.href = '/h5/views/main/index.html';
                        },
                        back: function() {
                            if (location.search) {
                                location.href = location.search.substring(13);
                            } else {
                                location.href = '/h5/views/main/index.html';
                            }
                        }
                    }
                }
            },
            ready: function() {
                nav.setActiveNav("account");
                $('#myloading').remove();
                //分享
                weixin.setTitle()
                    .setDesc()
                    .setImg()
                    .setUrl()
                    .share();
            }
        });
    }); //isLogin的结束


});