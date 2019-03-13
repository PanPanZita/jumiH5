define(['nav', 'vue', 'getPara', 'weixin','load','scrolltotop'], function(nav, vue, getPara, weixin,load,scrolltotop) {
    var para = getPara.get();
    var activityId = para.special_id;
    var parainit = {
        activityId: activityId,
        currentPage: 1,
        pageSize: 20,
        requestSource: 'WAP'
    };
    $.ajax({
        url: '/activity/getExchangeOrLotteryList',
        type: 'post',
        dataType: 'json',
        data: parainit,
        success: function(data) {
            // console.log(data);
            if (data.code == '0000') {
                new vue({
                    el: 'body',
                    components: {
                        'my-record': {
                            template: '#recordTemplate',
                            data: function() {
                                return {
                                    data: data.data,
                                    awardLogList: data.data.awardLogList,
                                    currentPage: 1,
                                    isLoading: 0,
                                    pageSize: 20,
                                    isIOSShow: (localStorage.fromapp == 'ios'), //为IOS通过官方审核而用
                                }
                            },
                            methods: {
                            }
                        }
                    },
                    ready: function() {
                        var that = this;
                        nav.setActiveNav("discover");
                        $('#myloading').remove();

                        //分享
                        weixin.setTitle()
                            .setDesc()
                            .setImg()
                            .setUrl()
                            .share();

                        //上拉刷新-加载更多记录
                        load.pullup({
                            button:'#loadMoreButton',
                            callback:function(options){
                                var component = that.$children[0];

                                options.currentPage++;

                                var paraload = {
                                    activityId: activityId,
                                    pageSize: 20,
                                    currentPage: options.currentPage,
                                    requestSource: 'WAP'
                                };
                                $.ajax({
                                    url: "/activity/getExchangeOrLotteryList",
                                    type: 'post',
                                    dataType: 'json',
                                    data: paraload,
                                    success: function(data) {
                                        if (data.code == '0000') {
                                            if (data.data != null && data.data.awardLogList != null && data.data.awardLogList.length > 0) {
                                                for(var i=0;i<data.data.awardLogList.length;i++){
                                                    component.awardLogList.push(data.data.awardLogList[i]);
                                                }
                                                options.isLoading = 0;
                                            }else{
                                                options.isLoading = 2;
                                                $(options.button).html('-- 我已倾囊相授 --');
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });

});