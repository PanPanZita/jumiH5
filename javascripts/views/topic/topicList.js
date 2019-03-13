define(['nav', 'vue', 'weixin','scrolltotop'], function(nav, vue, weixin,scrolltotop) {
    var parainit = {
        requestSource: 'WAP'
    };
    $.ajax({
        url: '/activity/getSpecialList',
        type: 'post',
        dataType: 'json',
        data: parainit,
        success: function(data) {
            // console.log(data);
            if (data.code == '0000') {
                new vue({
                    el: 'body',
                    components: {
                        'my-topiclist': {
                            template: '#topiclistTemplate',
                            data: function() {
                                return {
                                    data: data.data,
                                    specialList: data.data.specialList,
                                    isIOSShow: (localStorage.fromapp == 'ios') //为IOS通过官方审核而用
                                }
                            }
                        }
                    },
                    ready: function() {
                        nav.setActiveNav("discover");
                        $('#myloading').remove();
                        // var that = this;
                        // console.log(that.$root.$children[0].specialList.length);
                        //分享
                        weixin.setTitle()
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