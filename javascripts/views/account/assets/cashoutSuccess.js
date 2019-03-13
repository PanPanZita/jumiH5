define(['jumi', 'nav', 'isLogin', 'vue', 'weixin'], function(jumi, nav, isLogin, vue, weixin) {

    isLogin(function() {
        new vue({
            el: 'body',
            components: {
                'my-cashout': {
                    template: '#cashoutTemplate',
                    data: function() {
                        return {}
                    },
                    methods: {
                        cashoutRecord: function() {
                            location.href = '/h5/views/account/assets/cashoutRecord.html';
                        },
                        backassets: function() {
                            location.href = '/h5/views/account/assets/assets.html'; //返回聚米账户
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