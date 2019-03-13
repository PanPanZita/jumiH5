define(['nav', 'asyncload', 'weixin', 'getPara', 'vue','scrolltotop'], function(nav, asyncload, weixin, getPara, vue,scrolltotop) {
    var para = getPara.get();
    var parainit = {
        specialId: para.topic_id,
        requestSource: 'WAP'
    };

    $.ajax({
        url: '/activity/getActivityListBySpecial',
        type: 'post',
        dataType: 'json',
        data: parainit,
        success: function(data) {
            // console.log(data);
            if (data.code == '0000') {
                new vue({
                    el: 'body',
                    components: {
                        'my-topicsingle': {
                            template: '#topicSingleTemplate',
                            data: function() {
                                return {
                                    data: data.data,
                                    actionList: data.data.actionList,
                                    isIOSShow: (localStorage.fromapp == 'ios') //为IOS通过官方审核而用
                                }
                            }
                        }
                    },
                    ready: function() {
                        nav.setActiveNav("discover");
                        $('#myloading').remove();
                        $('.async').asyncload();
                        var that = this;
                        var name = that.$children[0].data.name; //分享所用
                        weixin.setTitle(name)
                            .setDesc()
                            .setImg()
                            .setUrl()
                            .share();
                    }
                });
            }
        }
    });

});