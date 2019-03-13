define(['jumi', 'nav', 'vue', 'isLogin', 'getPara', 'weixin'], function(jumi, nav, vue, isLogin, getPara, weixin) {
    var para = getPara.get();
    var result = para.result;
    // console.log(result);
    // console.log(typeof(result));
    isLogin(function() {
        new vue({
            el: 'body',
            components: {
                'my-openaccount': {
                    template: '#openaccountTemplate',
                    data: function() {
                        return {
                            result: result
                        }
                    },
                    methods: {
                        backIndex: function() {
                            location.href = '/h5/views/main/index.html';
                        },
                        personInfo: function() {
                            location.href = '/h5/views/account/account.html';
                        }
                    }
                }
            },
            ready: function() {
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