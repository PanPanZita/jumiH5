define(['nav', 'vue', 'DateFormat', 'weixin','load','scrolltotop'], function(nav, vue, DateFormat, weixin,load,scrolltotop) {
    var token = localStorage.getItem("token");
    var parainit = {
        currentPage: 1,
        pageSize: 20,
        token: token,
        requestSource: 'WAP'
    };
    $.ajax({
        url: '/activity/getMyLotteryRecord',
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
                                    isLoading: 0, //0加载更多，1正在加载，2无更多记录
                                    isIOSShow: (localStorage.fromapp == 'ios') //为IOS通过官方审核而用
                                }
                            },
                            methods: {
                            },
                            filters: {
                                timeStr: function(timeStr) {
                                    return new Date(timeStr).Format('yyyy-MM-dd hh:mm');
                                }
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
                                    pageSize: 20,
                                    currentPage: options.currentPage,
                                    token: token,
                                    requestSource: 'WAP'
                                };
                                $.ajax({
                                    url: "/activity/getMyLotteryRecord",
                                    type: 'post',
                                    dataType: 'json',
                                    data: paraload,
                                    success: function(data) {
                                        // console.log(data);
                                        if (data.code == '0000') {
                                            if (data.data != null && data.data.awardLogList != null && data.data.awardLogList.length > 0) {
                                                for(var i=0;i<data.data.awardLogList.length;i++){
                                                    component.data.awardLogList.push(data.data.awardLogList[i]);
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