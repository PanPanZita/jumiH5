define(['jumi', 'vue', 'isLogin', 'getPara', 'weixin'], function(jumi, vue, isLogin, getPara, weixin) {
    var para = getPara.get();
    var token = localStorage.getItem("token"); //为了验证用户是否登录
    // console.log(token);
    isLogin(function() {
        new vue({
            el: 'body',
            components: {
                'my-nickname': {
                    template: '#nicknameTemplate',
                    data: function() {
                        return {
                            user_id: para.user_id,
                            nickname: decodeURI(para.nickname)
                        }
                    },
                    methods: {
                        save: function() {
                            var patrn_null = /^\S{0}$/; //非空
                            var patrn_special = /^[\u0391-\uFFE5\w]+$/; //不允许包含特殊符号
                            var patrn_length = /^\S{2,15}$/; //长度区间
                            var val = this.nickname; //input值

                            if (patrn_null.test(val)) {
                                jumi.tips('昵称不能为空！');
                                return;
                            }
                            if (!patrn_special.test(val)) {
                                jumi.tips('昵称不允许特殊字符！');
                                return;
                            }
                            if (!patrn_length.test(val)) {
                                jumi.tips('昵称长度为2-15个字符之间！');
                                return;
                            }

                            var paraname = {
                                nickname: val,
                                token: token,
                                requestSource: 'WAP',
                            }

                            $.ajax({
                                type: 'post',
                                url: '/userCenter/setting/updateUser',
                                data: paraname,
                                dataType: 'json',
                                success: function(data) {
                                    // console.log(data);
                                    if (data.code == '0000') {
                                        location.href = '/h5/views/account/settings/personal.html';
                                    }
                                }
                            });
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
        })
    }); //isLogin的结束

});